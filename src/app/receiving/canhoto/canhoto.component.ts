import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';

// models/invoice-daily.model.ts
export interface InvoiceDaily {
  serial: number;
  docNum: number;
  cardCode: string;
  cardName: string;
  keyNfe: string;
}

export interface VisitAccess {
  idVisitor: number;
  name: string;
  lastVisitId: number;
  travels: number[];
}

@Component({
  selector: 'app-canhoto',
  templateUrl: './canhoto.component.html',
  styleUrls: ['./canhoto.component.scss'],
})
export class CanhotoComponent implements OnInit {

  // Filtros / lista
  searchDocNum: string = '';
  selectedDate: string = ''; // usuário precisa informar a data
  invoices: InvoiceDaily[] = [];
  loading = false;

  // Mensagens globais
  errorMessage = '';
  successMessage = '';

  // Modal
  showModal = false;
  selectedInvoice: InvoiceDaily | null = null;

  // Chave de acesso
  expectedKey: string = '';     // vinda da API (keyNfe)
  scannedKey: string = '';      // bipada/digitada pelo usuário

  // Foto (via input nativo)
  capturedImage: string | null = null; // DataURL para preview
  selectedFile: File | null = null;    // Arquivo para upload

  // Flags de operação
  downExitLoading = false;
  uploadPhotoLoading = false;

  constructor(private accessService: SapServiceService, private navCtrl: NavController) { }

  ngOnInit(): void {
    this.selectedDate = new Date().toISOString().substring(0, 10);
  }

    backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  // ====== LISTA ======

  loadInvoices(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.invoices = [];
    this.searchDocNum = ''; // limpa filtro ao carregar nova data

    if (!this.selectedDate) {
      this.errorMessage = 'Informe a data para carregar as notas.';
      return;
    }

    this.loading = true;

    this.accessService.getInvoiceDaily(this.selectedDate).subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao carregar notas de entrega.';
        this.loading = false;
      }
    });
  }

  get filteredInvoices(): InvoiceDaily[] {
    if (!this.searchDocNum?.trim()) {
      return this.invoices;
    }

    const term = this.searchDocNum.trim();
    return this.invoices.filter(inv =>
      inv.serial.toString().includes(term)
    );
  }

  // ====== MODAL ======

  openModal(invoice: InvoiceDaily): void {
    this.selectedInvoice = invoice;
    this.expectedKey = invoice.keyNfe;
    this.scannedKey = '';
    this.capturedImage = null;
    this.selectedFile = null;
    this.successMessage = '';
    this.errorMessage = '';

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  // ====== FOTO (input nativo: câmera no celular / arquivo no PC) ======

  // Abre o seletor nativo
  openPicker(input: HTMLInputElement): void {
    try { input.value = ''; } catch {}
    setTimeout(() => input.click(), 0);
  }

  // Quando o usuário tira a foto / escolhe a imagem
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
    this.successMessage = '';

    const reader = new FileReader();
    reader.onload = () => {
      this.capturedImage = reader.result as string;
    };
    reader.onerror = () => {
      this.errorMessage = 'Erro ao ler o arquivo de imagem.';
      this.capturedImage = null;
      this.selectedFile = null;
    };
    reader.readAsDataURL(file);
  }

  clearPhoto(): void {
    this.capturedImage = null;
    this.selectedFile = null;
  }

  // ====== AÇÕES DA ENTREGA ======

  baixarEntrega(): void {
    if (!this.selectedInvoice) return;

    if (!confirm(`Confirmar baixa da entrega do DocNum ${this.selectedInvoice.docNum}?`)) {
      return;
    }

    this.downExitLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.accessService.downExit(this.selectedInvoice.docNum).subscribe({
      next: () => {
        this.downExitLoading = false;
        this.successMessage = `Entrega do documento ${this.selectedInvoice?.docNum} baixada com sucesso.`;

        // Remover item da lista
        this.invoices = this.invoices.filter(i => i.docNum !== this.selectedInvoice?.docNum);
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.downExitLoading = false;
        this.errorMessage = 'Erro ao baixar entrega.';
      }
    });
  }

  salvarFoto(): void {
    if (!this.selectedInvoice) return;

    if (!this.selectedFile) {
      this.errorMessage = 'Selecione ou capture uma foto antes de salvar.';
      return;
    }

    this.uploadPhotoLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.accessService.uploadCanhoto(this.selectedInvoice.docNum, this.selectedFile).subscribe({
      next: () => {
        this.uploadPhotoLoading = false;
        this.successMessage = `Foto do canhoto salva para o documento ${this.selectedInvoice?.docNum}.`;
        // opcional:
        // this.clearPhoto();
        // this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.uploadPhotoLoading = false;
        this.errorMessage = 'Erro ao salvar a foto do canhoto.';
      }
    });
  }

  // Comparação simples da chave (visual)
  isKeyOk(): boolean {
    if (!this.scannedKey) return true; // sem erro até digitar
    return this.scannedKey === this.expectedKey;
  }
}
