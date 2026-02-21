import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardPage, DashboardStatus } from 'src/app/dashboard/dashboard.page';
import { ImagensCol, ProductsRequest, SalesOrdersList, ViagemsListMobile, ViagemsListMobileV2, Viagens, VolumesListMobileV2, VolViewer } from 'src/app/models/sales-orders-list';
import { CutsBase, Disponiveis, Pack, PackId, PackItenv2, PickingList, ReserveV1, ReserveV1Documents, ReversePackItem, VolumesItem } from 'src/app/models/uas';
import { InvoiceDaily, VisitAccess } from 'src/app/receiving/canhoto/canhoto.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SapServiceService {

  uriCrm = environment.apiCrm
  uriMobile = environment.apiMobile
  uriLogin = environment.apiLogin

  constructor(private http: HttpClient) { }

  getInvoiceDaily(date: string): Observable<InvoiceDaily[]> {
    return this.http.get<InvoiceDaily[]>(`${this.uriMobile}/access/invoice-daily/${date}`);
  }

  downExit(docNum: number): Observable<any> {
    return this.http.patch(`${this.uriMobile}/access/down-exit/${docNum}`, null);
  }

  uploadCanhoto(docNum: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.uriMobile}/access/canhoto/${docNum}`, formData);
  }

  getDisponiveisWithPack(absEntry: any, slpCode: any) {
    return this.http.get<Disponiveis[]>(`${this.uriMobile}/pack/get-disponiveis/${absEntry}/${slpCode}`)
  }

  getDisponiveisByDocnumWithPack(docNum: any) {
    return this.http.get<Disponiveis[]>(`${this.uriMobile}/pack/get-disponiveis/${docNum}`)
  }


  getPackByDocNumAndVol(docNum: any, volume: any) {
    return this.http.get<ReversePackItem[]>(`${this.uriMobile}/pack/get-pack-vol-reserve/${docNum}/${volume}`)
  }

  getPackByDocNumAndItemCode(docNum: any, itemCode: any) {
    return this.http.get<VolumesItem[]>(`${this.uriMobile}/pack/get-pack-by-order-and-item/${docNum}/${itemCode}`)
  }
  updatePackItens(docEntry: number, lineNum: number) {
    return this.http.patch(`${this.uriMobile}/picking/finish-pecas/docentry/${docEntry}/linenum/${lineNum}`, null)
  }

  printTag(obj: any) {
    return this.http.post(`${this.uriMobile}/tags/print-order-tag-by-packitem`, obj)
  }

  getPackItens(id: any) {
    return this.http.get<PackItenv2[]>(`${this.uriMobile}/pack/get-pack-item-by-idpack/${id}`)
  }

  getDashboardPicking(userId: any) {
    return this.http.get<DashboardStatus[]>(`${this.uriMobile}/picking/resume/${userId}`)
  }

  getPackItensViewer(id: any) {
    return this.http.get<VolViewer[]>(`${this.uriMobile}/pack/get-pack-item-by-idpack/${id}`)
    //
  }
  createPackList(obj: any) {
    return this.http.post<any>(`${this.uriMobile}/pack/add-pack`, obj)
  }

  getVisitDetails(idViagem: any) 
  {
    return this.http.get<any>(`${this.uriMobile}/access/visit/${idViagem}/details`)
  }

  createPackListV2(obj: any) {
    return this.http.post<any>(`${this.uriMobile}/pack/v2/add-pack`, obj)
  }
  createPackListAndPrinter(obj: any, ipPrinter: any) {
    return this.http.post<any>(`${this.uriMobile}/pack/add-pack/${ipPrinter}`, obj)
  }

  finishPickWihoutFU(lineNum: any, absEntry: any, obs: string, sessionId: any) {
    var obj = {
      message: obs
    }
    return this.http.post(`${this.uriMobile}/picking/finish-pick/${lineNum}/${absEntry}/${sessionId}`, obj)
  }

  finishPick(obj: any) {
    return this.http.post(`${this.uriMobile}/picking/finish-pick`, obj)
  }

  desfazPick(docNum: number, lineNum: number, batch: string, sessionId: string) {
    return this.http.post(`${this.uriMobile}/picking/desfaz/${docNum}/line/${lineNum}/batch/${batch}/session/${sessionId}`, null)
  }

  finishEnvioExpedition(viagem: any, userid: any) {
    return this.http.post(`${this.uriMobile}/viagem/finish-expedition/${viagem}/userid/${userid}`, null)
  }

  uploadImages(images: ImagensCol[], docNum: number, lineNum: number): Observable<any> {
    const imageObjects = images.map(img => (
      {
        docNum: docNum,
        imageBase64: img.imagem,
        lineNum: lineNum,
        tipo: img.tipo
      }));

    imageObjects.forEach(i => {

    })
    return this.http.post(`${this.uriCrm}/images/upload`, imageObjects);
  }

  getImages(docNumber: any, itemCode: any) {
    return this.http.get<any[]>(`${this.uriMobile}/images/list/${docNumber}/${itemCode}`)
  }

  createIssuer(obj: any) {
    return this.http.post(`${this.uriMobile}/issues/create-issuer`, obj)
  }

  saveObsPicking(obj: any) {
    return this.http.post(`${this.uriMobile}/picking/save-obs`, obj)
  }

  saveObsConference(obj: any) {
    return this.http.post(`${this.uriMobile}/picking/save-obs-conference`, obj)
  }

  finishCheckout(obj: any) {
    return this.http.patch(`${this.uriMobile}/pack/checkout/check`, obj)
  }

  postConfirmItem(obj: any) {
    return this.http.post(`${this.uriMobile}/picking/confirm-item-batch`, obj)
  }

  postReversaNew(obj: any) {
    return this.http.post(`${this.uriMobile}/pack/reverse`, obj)
  }

  postCreatePackReversaNew(obj: any) {
    return this.http.post(`${this.uriMobile}/pack/reverse/createpack`, obj)
  }

  patchPackages(id: any, obj: number) {
    //descontinuado
    return this.http.post(`${this.uriMobile}/pack/reverse`, obj)
  }

  patchReversaNew(obj: any) {
    return this.http.patch(`${this.uriMobile}/pack/reverse`, obj)
  }

  postRetornaUANew(obj: any, sessionId: any) {
    sessionId = 'aac38e94-edcf-11f0-8000-005056b99131';
    return this.http.post(`${this.uriMobile}/pack/reverse/returnua?sessionId=${sessionId}`, obj)
  }

  postLogin(obj: any) {
    return this.http.post(`${this.uriLogin}/Login`, obj)
  }

  getCutsBase() {
    return this.http.get<CutsBase[]>(`${this.uriMobile}/picking/demand-corte`)
  }

  getCutsBaseByDocnum(docNum: number) {
    return this.http.get<CutsBase[]>(`${this.uriMobile}/picking/demand-corte/${docNum}/details`)
  }

  updatePecasCutsBaseV3(obj: any){
   return this.http.patch(`${this.uriMobile}/picking/update-pecas/v3/finish`, obj)
     
  }

  updatePecasCutsBase(id: number, pecas: number, volume: number, docEntry: number, lineNum: number) {
    return this.http.patch(`${this.uriMobile}/picking/update-pecas/${id}/pecas/${pecas}/volumes/${volume}/docEntry/${docEntry}/lineNum/${lineNum}`, null)
  }

  getOrderByUser(range: string, userName: string) {
    return this.http.get<SalesOrdersList[]>(`${this.uriMobile}/picking/picking-by-name/details/${range}/${userName}`)
  }

  getPickingList(id: any, slpCode: any) {
    return this.http.get<PickingList[]>(`${this.uriMobile}/picking/picking-details/${id}/${slpCode}`)
  }

  getPickingListItem(absEntry: any, line: any, objType: any) {
    return this.http.get<ProductsRequest>(`${this.uriMobile}/picking/picking-details/${absEntry}/available/${line}/${objType}`)
  }

  getAllVolumesByPickList(absEntry: number, slpCode: any) {
    return this.http.get<Pack[]>(`${this.uriMobile}/pack/get-list-pack-list/${absEntry}/${slpCode}`)
  }

  getViagems() {
    return this.http.get<Viagens[]>(`${this.uriMobile}/viagem/list-viagens`)
  }

  getViagemByVisit(visitas: string) 
  {
    return this.http.get<Viagens[]>(`${this.uriMobile}/viagem/list-viagens/programacao/v2/${visitas}`)
  }
  
  getVisitsByDate(date: string): Observable<VisitAccess[]> {
    // date no formato YYYY-MM-DD
    return this.http.get<VisitAccess[]>(`${this.uriMobile}/access/visit/${date}`);
  }

  getViagemByFilters(pedido: number, datereference: string) {

    var and = `?pedidoOrId=${pedido}`;

    if (pedido == 0 || pedido == undefined || pedido == null) {
      and = '';
    }

    return this.http.get<Viagens[]>(`${this.uriMobile}/viagem/list-viagens/programacao/datereference/${datereference}${and}`)
  }

  getViagemsMobile(id: any) {
    return this.http.post<ViagemsListMobile[]>(`${this.uriMobile}/viagem/list-itens-mobile/${id}`, null)
  }

  getVolumesListMobileV2(idTravel: any, volume: any) {
    return this.http.get<VolumesListMobileV2[]>(`${this.uriMobile}/viagem/list-itens-per-volume/${idTravel}/volume/${volume}`)
  }

  updateTravel(lineid: any, userId: any) {

    return this.http.post(`${this.uriMobile}/viagem/confirm-delivery/${lineid}/user/${userId}`, null)

  }

  getViagemsMobileV2(id: any) {
    return this.http.get<ViagemsListMobileV2[]>(`${this.uriMobile}/viagem/list-itens/${id}/volumes`)
  }

  getAllReverses() {
    return this.http.get<ReserveV1[]>(`${this.uriMobile}/pack/reverse/all`)
  }

  getAllVolumesWithCheckout() {
    return this.http.get<Pack[]>(`${this.uriMobile}/pack/get-list-pack`)
  }

  getAllReverseByDocNum() {
    return this.http.get<ReserveV1Documents[]>(`${this.uriMobile}/pack/reserve/all/documents`)
  }

  getAllReverseByVolumes(docNum: any) //DOCNUMBER
  {
    return this.http.get<ReserveV1Documents[]>(`${this.uriMobile}/pack/reserve/all/pack/${docNum}`)
  }

  getAllReverseVolumesByDocNumber(docNum: number) //VOLUMES
  {
    return this.http.get<Pack[]>(`${this.uriMobile}/pack/reserve/pack/${docNum}`)
  }

  //getAllReverseVolumesByItemCode(docNum: any, idPack: any) //ITEMCODE
  //{
  //  return this.http.get<Pack[]>(`${this.uriMobile}/pack/reserve/pack/${docNum}`)
  //}

  getAllReverseVolumesByItemCode(docNum: number) {
    return this.http.get<Pack[]>(`${this.uriMobile}/pack/reserve/pack/${docNum}`)
  }

  getPackByAbsDocnum(absEntry: number, lineNum: number) {
    return this.http.get<PackId>(`${this.uriMobile}/pack/volumes-by-order/${absEntry}/${lineNum}`)
  }

  Pack(id: any) {
    return this.http.patch(`${this.uriCrm}/pack//${id}`, null)
  }
   cancelPack(id: any)
  {
    return this.http.patch(`${this.uriCrm}/pack/cancel/${id}`, null)
  }
}
