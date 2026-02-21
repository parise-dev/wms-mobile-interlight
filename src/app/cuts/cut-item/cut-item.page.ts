import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Volume, VolumesReformulated, VolViewer } from 'src/app/models/sales-orders-list';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CutsBase, Pack, PackId, PackItenv2 } from 'src/app/models/uas';
import { SapServiceService } from 'src/app/shared/services/sap-service.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cut-item',
  templateUrl: './cut-item.page.html',
  styleUrls: ['./cut-item.page.scss'],
})
export class CutItemPage implements OnInit, AfterViewInit {


  cuts: string[] = [];
  volume: Volume[] = [];
  ipPrinters: string = '';
  qtdeNewPC: any = null;
  qtdeNewVolume: any = null;
  qtdeNewWeight: any = null;
  addNEwPacking: Pack = {} as Pack;
  newsPacks: Pack[] = [];
  disponiveisPrint: PackId = {} as PackId;
  qtdeNewVolumeDisable: boolean = false;
  qtdeNewVolumeConfirmed: boolean = false;
  volumes: VolumesReformulated[] = [];
  newPackingItem: PackItenv2 = {} as PackItenv2;
  addNewPackItemTotal: PackItenv2[] = [];
  cutsBase: CutsBase[] = [];
  indexCut: number = 0;
  obsNew: string = '';
  docnumRouter: string = '';

  finished: boolean = false;
  //volume: VolumesReformulated = {} as VolumesReformulated;

  constructor(private navCtrl: NavController,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toast: ToastrService,
    private service: SapServiceService,
    private route: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this.service.getCutsBaseByDocnum(this.route.snapshot.params['id']).subscribe((data) => {
      this.cutsBase = data.sort((a, b) => {
        if (a.id !== b.id) return a.id - b.id;

        return a.package - b.package;
      });
    })
  }

  ngOnInit() {
    this.docnumRouter = this.route.snapshot.params['id'];
    this.service.getCutsBaseByDocnum(this.route.snapshot.params['id']).subscribe((data) => {
      this.cutsBase = data.sort((a, b) => {
        if (a.id !== b.id) return a.id - b.id;

        return a.package - b.package;
      });
    })
  }


  backHome() {
    this.navCtrl.navigateForward('/cuts', { replaceUrl: true });
  }

  confirmCriacao() {

    var error = []

    this.newsPacks.forEach(it => {
      this.service.createPackListAndPrinter(this.addNEwPacking, this.ipPrinters).subscribe(
        () => {


        }, () => {
          error.push(1)
        })
    })


    if (error.length == 0) {
      this.toast.success('Volumes criado com sucesso.')
    }




    this.addNEwPacking = {} as Pack;

    this.modalService.dismissAll();
    this.service.getCutsBase().subscribe((data) => {
      this.cutsBase = data
    })
  }

  formatVolV1(id: number) {
    return '#VOL' + id.toString().padStart(6, '0')
  }


  createVolume() {

    if (this.addNEwPacking.package_Name == null || this.addNEwPacking.package_Name == undefined) {
      this.toast.error('Informe o tipo de embalagem para seguir')
      return
    }

    if (this.addNEwPacking.destiny == null || this.addNEwPacking.destiny == undefined) {
      this.toast.error('Informe a localização para seguir a criação do volume')
      return
    }

    let volume: VolumesReformulated = {} as VolumesReformulated;

    let total = this.volumes.reduce((soma, vol) => soma + vol?.qtdePecas, 0);

    if (this.qtdeNewPC === 0) {
      this.toast.error('Não é possivel criar volume com quantidade zerada.')
      return;
    }


    if ((total + this.qtdeNewPC) > this.qtdeNewVolume) {
      this.toast.error('Quantidade de Peças supera as disponíveis.')
      return;
    }

    volume.nameVolume = `NOVO VOLUME ${this.volumes.length + 1}`
    volume.qtdePecas = this.qtdeNewPC

    this.volumes.push(volume)

    if ((total + this.qtdeNewPC) == this.qtdeNewVolume) {
      this.finished = true;
    }

    this.addNEwPacking.createDate = moment().format('YYYY-MM-DD')
    this.addNEwPacking.id = 0,
      this.addNEwPacking.itens = 0,
      this.addNEwPacking.packItens = [],
      this.addNEwPacking.status = 'EM PREPARAÇÃO'
    this.addNEwPacking.weight = this.qtdeNewWeight
    this.addNEwPacking.userId = JSON.parse(localStorage.getItem('authorize') ?? '').userid
    this.addNEwPacking.username = JSON.parse(localStorage.getItem('authorize') ?? '').slpName

    var addNewPackItem: PackItenv2 =
    {
      id: 0,
      idPack: 0,
      lineNum: this.cutsBase[this.indexCut].lineNum,
      itemCode: this.cutsBase[this.indexCut].itemCode,
      description: this.cutsBase[this.indexCut].description,
      batch: this.cutsBase[this.indexCut].batch,
      quantity: 0,
      docNumber: this.cutsBase[this.indexCut].docNum,
      docType: '17',
      obs: this.obsNew,
      pack: this.qtdeNewPC,
      absEntry: this.cutsBase[this.indexCut].pickList
    }

    this.addNewPackItemTotal.push(addNewPackItem)

    this.addNEwPacking.packItens = this.addNewPackItemTotal

    this.newsPacks.push(this.addNEwPacking)



  }

  confirmedQtde() {

    if (this.qtdeNewVolume == 0 || this.qtdeNewVolume == null || this.qtdeNewVolume == undefined) {
      this.toast.error('Por favor informar a quantidade de peças')
    }

    this.spinner.show()

    var obj = {
      itemCode: this.cutsBase[this.indexCut].itemCode,
      lineNum: this.cutsBase[this.indexCut].orderLine,
      pickLine: this.cutsBase[this.indexCut].lineNum,
      docNum: this.cutsBase[this.indexCut].docNum,
      absEntry: this.cutsBase[this.indexCut].pickList,
      package: this.qtdeNewVolume,
      userId: 0
    }

    this.service.updatePecasCutsBaseV3(obj
    ).subscribe(() => {

      this.service.getCutsBaseByDocnum(this.route.snapshot.params['id']).subscribe((data) => {

        this.cutsBase = data.sort((a, b) => {
          if (a.id !== b.id) return a.id - b.id;












          return a.package - b.package;
        });

        this.toast.success('Atualizado com sucesso !')
        this.qtdeNewVolume = null

        this.modalService.dismissAll()
      })

      this.spinner.hide()
    }, () => {
      this.spinner.hide()
    })
  }

  addTable() {

  }

  cutPecasProntas(obj: CutsBase[]) {

    obj.filter(os => os.manutencao == true)

    if (obj.length > 0) {
      return true
    }

    return false
  }

  cancelConfirmed() {
    this.qtdeNewVolumeDisable = false;
    this.qtdeNewVolumeConfirmed = false;
    this.qtdeNewVolume = null
  }


  openModal(content: any, index: number, typeM?: string) {

    if (typeM != null) {
      console.log('cut base', this.cutsBase)
      this.service.getPackByAbsDocnum(

        this.cutsBase[index].pickList,
        this.cutsBase[index].lineNum).subscribe((data) => {
          this.disponiveisPrint = data

          //this.formatVol(data.idPack);

          this.volume = data.idPack
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(id => ({
              id,
              vols: '#VOL' + id.padStart(6, '0'),
              check: false
            }));
        })
    }
    this.indexCut = index;

    console.log(content.toString())

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }


  concluirItem() {
    this.spinner.show()
    console.log('disponiveisPrint', this.disponiveisPrint)

    this.service.updatePackItens(this.disponiveisPrint.docEntry, this.cutsBase[this.indexCut].orderLine).subscribe(() => {
      this.toast.success(`Finalizado com sucesso`)
      this.spinner.hide()
      this.modalService.dismissAll();

      this.service.getCutsBaseByDocnum(this.route.snapshot.params['id']).subscribe((data) => {
        this.cutsBase = data.sort((a, b) => {
          if (a.id !== b.id) return a.id - b.id;

          return a.package - b.package;
        });
      })
    }, () => {
      this.toast.error('Falha ao finalizar pacote, tente novamente')
      this.spinner.hide()
    })
  }


  addUrlNewPage() {
    localStorage.setItem('absEntryCut', this.docnumRouter)
    this.navCtrl.navigateForward('cuts/volume-new', { replaceUrl: true });
  }

  getCheckedVolumes(): Volume[] {
    return (this.volume ?? []).filter(v => v.check === true);
  }

  print() {

    var vols = this.getCheckedVolumes()

    if (this.ipPrinters === 'Selecione') {
      this.toast.error('Selecione uma impressora');
      return;
    }


    if (vols) {
      vols.forEach(i => {

        var obj = {
          idPack: Number(i.id.toString().trim()),
          ipPrinters: this.ipPrinters
        }

        this.service.printTag(obj).subscribe(() => {
          this.toast.success(`Enviado para impressora ${this.ipPrinters}`)
        }, () => {
          this.toast.error('Falha ao imprimir, tente novamente')
        })
      })

    }

  }


  cancelarVolume() {

    var vols = this.getCheckedVolumes()

    vols.forEach(it => {
      this.service.cancelPack(it.id).subscribe(() => {
        console.log('Cancelado')
      })
    })

    this.modalService.dismissAll()
    this.toast.success('Cancelado com sucesso')

  }


}
