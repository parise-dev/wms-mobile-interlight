import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';
import { ToastrService } from 'ngx-toastr';



interface Visit {
  id: number;
  name: string;
  idVisitor: number;
  entry: string;
  exit: string | null;
  vehicle: string | null;
  loadDate: string | null;
  invoiceDate: string | null;
  justification: string | null;
  observation: string | null;
  dock: string | null;
  idTravel: number | null;
  status: string | null;
  carrier: string | null;
  idEntry: number | null;
  reasonVisit: string | null;
  checkerName: string | null;
nfPendentes: number | null;
}

interface DriverItem {
  idVisitor: number;
  name: string;
  lastVisitId: number;
  nFPendente: number;
  idEntry: number;
  status: string | null;
  carrier?: string;
  checkerName: string | null;
  
  entry?: string;
  travels: number[]; // viagens desse motorista
}

interface VisitDetails {

  
  id: number;
  name: string;
  statusViagem: string;
  docNum: number;
  cardName: string;
  nf: number
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  showJustificationModal = false;
  justification = '';

  drivers: DriverItem[] = [];
  loading = false;
  travels: VisitDetails[] = [];

  showModal = false;
  selectedDriver: DriverItem | null = null;
  dock = '';

  constructor(private http: HttpClient, 
    private navCtrl: NavController,
    private toast: ToastrService,
     private service: SapServiceService) { }

  ngOnInit(): void {
    this.loadDrivers();
    
  }

  openJustificationModal() {
  this.justification = '';
  this.showJustificationModal = true;
}

closeJustificationModal() {
  this.showJustificationModal = false;
}

confirmJustification() {
  if (!this.selectedDriver || !this.justification) {
    return;
  }

  const payload = {
    id: this.selectedDriver.idEntry, // ou outro ID correto
    justication: this.justification
  };

  this.http.post(
    'http://192.168.10.15:9992/api/access/set-justification',
    payload
  ).subscribe({
    next: () => {
      this.closeJustificationModal();
      this.closeModal(); // fecha modal principal se quiser
      this.loadDrivers(); // recarrega lista
    },
    error: (err) => {
      console.error('Erro ao enviar justificativa', err);
    }
  });
}


  loadDrivers(): void {
    this.loading = true;
    var dateValid = moment().format('YYYY-MM-DD');
    // ajuste a data/URL conforme sua API
    const url = `http://192.168.10.15:9992/api/access/visit/${dateValid}`;

    this.http.get<Visit[]>(url).subscribe({
      next: (visits) => {
        console.log('Retorno da API:', visits);

        const map = new Map<number, DriverItem>();



        visits.forEach((v) => {

          if (v.reasonVisit !== "Coleta de Mercadoria" && v.reasonVisit !== "Nosso Carro") {
            return;
          }

          if (!map.has(v.idVisitor)) {
            map.set(v.idVisitor, {
              idVisitor: v.idVisitor,
              name: v.name,
              lastVisitId: v.id,
              nFPendente: v?.nfPendentes ?? 0,
              status: v.status,
              checkerName: v.checkerName,
              carrier: v.carrier?.toString().substring(0, 16) ?? '',
              entry: v.entry,
              idEntry: v.idEntry ?? 0,
              travels: [],
            });
          }

          const driver = map.get(v.idVisitor)!;

          driver.lastVisitId = v.id;

          if (v.idTravel != null) {
            if (!driver.travels.includes(v.idTravel)) {
              if (v.reasonVisit === "Coleta de Mercadoria") {
                console.log('entrei')
                driver.travels.push(v.idTravel);
              }

            }
          }
        });

        this.drivers = Array.from(map.values());
        console.log('Drivers montados:', this.drivers);
      },
      error: (err) => {
        console.error('Erro ao buscar motoristas', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  openModal(driver: DriverItem): void {
    this.service.getVisitDetails(driver.lastVisitId).subscribe((data) => this.travels = data)

    this.selectedDriver = driver;
    this.dock = '';
    this.showModal = true;
  }

  callMotorista() {



  }

  getStatusClass(status?: any): string {
  const s = (status || '').toLowerCase();

  // ajuste conforme seus status reais:
  if (s.includes('aguard') || s.includes('pend')) return 'status-chip--warn';
  if (s.includes('carreg') || s.includes('ok') || s.includes('liber')) return 'status-chip--ok';
  if (s.includes('cancel') || s.includes('saiu') || s.includes('não vai') || s.includes('erro')) return 'status-chip--danger';
  if (s.includes('em rota') || s.includes('em atendimento') || s.includes('process')) return 'status-chip--info';

  return 'status-chip--neutral';
}

  backHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }


  closeModal(): void {
    this.showModal = false;
    this.selectedDriver = null;
    this.dock = '';
  }

  getElapsedTime(entryIso: string): string {
    const start = moment(entryIso);
    const now = moment();
    const diffMin = now.diff(start, 'minutes');

    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin} min`;

    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  confirmLoading(): void {
    if (!this.selectedDriver || !this.dock) {
      return;
    }

    var x = localStorage.getItem('authorize') ?? ''
    var c = JSON.parse(x).slpName;

    console.log('drIVer name', this.selectedDriver)
    var obj = {
      driver: this.selectedDriver?.name,
      dock: this.dock,
      conferente: c
    }

    this.callMotorista()
    // Aqui você chama a API para confirmar o carregamento.
    // Exemplo (ajuste para sua rota real):
    /*
    const body = {
      idVisitor: this.selectedDriver.idVisitor,
      dock: this.dock
    };*/

    this.http.post(`http://192.168.10.15:9992/api/access/set-dok/${this.selectedDriver.lastVisitId}/userid/274/dock/${this.dock}`, null)
      .subscribe({
        next: () => {

          const url = 'http://192.168.10.15:9992/api/driverpanel/call-driver';

          this.http.post(url, obj).subscribe(() => {
            console.log('foi')
          })

          this.closeModal();
          this.loadDrivers(); // se quiser atualizar a tela depois da confirmação
        },
        error: err => {
          console.error('Erro ao confirmar carregamento', err);
        }
      });


    console.log('Confirmando carregamento:', {
      idVisitor: this.selectedDriver.idVisitor,
      dock: this.dock,
    });

    this.closeModal();
  }

  assumir(){
    
    //= localStorage.getItem('Name')
    
    const auth = localStorage.getItem('authorize');
    var checkerId = auth ? JSON.parse(auth)?.userid?.toString() ?? '' : '';
    var checkerName = auth ? JSON.parse(auth)?.slpName?.toString() ?? '' : '';
    

    
     const url = `http://192.168.10.15:9992/api/access/assumir?visitId=${this.selectedDriver?.lastVisitId ?? ''}&assumeId=${checkerId}&userName=${checkerName}`;
     this.http.patch(url, null).subscribe({
      next: data => {
        this.toast.success('Assumido')
       this.closeModal();
       this.loadDrivers();
      },
      error: err => {
        console.error('Erro ao carregar viagens com faturamento', err);
      }
    });
  }

  assumirViagem(): void {
    if (!this.selectedDriver) return;

    const separador = 'NOME_DO_SEPARADOR'; // você pega do usuário logado/localStorage

    const body = {
      visitId: this.selectedDriver.lastVisitId,
      separador
    };

    // troque pela sua rota real
    this.http.post(`http://192.168.10.15:9992/api/access/assumir`, body)
      .subscribe({
        next: () => {
          // opcional: recarregar lista e/ou atualizar badge
          this.loadDrivers();
        },
        error: err => console.error('Erro ao assumir', err)
      });
  }

  getPrimeiroNome(nome: string | null | undefined): string {
    if (!nome) return '';
    return nome.trim().split(/\s+/)[0];
  }

}
