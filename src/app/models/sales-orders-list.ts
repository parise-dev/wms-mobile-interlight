export interface SalesOrdersList {
  absEntry: number
  docNumDoc: number
  pickDate: string
  createDate: string
  baseObject: number
  cardCodeDoc: string
  cardNameDoc: string
  slpName: string,
  status: string
  ordem: number,
  prazoOperacional: string,
  u_WMS_Separador: number
  corte: number
  tipoFrete?: string
  faltaVol: number
  perfil?: string
}

export interface Volumes
{
  id: number;
  name: string;
  weight: number;
  pack: number;
  itens: VolumesItens[]
}

export interface VolumesItens 
{
  lineNum: number;
  itemCode: string;
  description: string;
  quantity: number;
  weight: number;
}

export interface ProductsRequest {
  line: Line
  items: Item[]
  questions: string[]
  sessionId?: string;
  clear?: boolean
 
}

export interface VolumesReformulated{
  nameVolume: string,
  qtdePecas: number,
  user: string;
  id: number;
}

export interface Volume {
  id: string;
  vols: string;
  check: boolean;
}

export interface ImagensCol{
  imagem: string,
  tipo: string
}

export interface VolViewer {
  id: number
  idPack: number
  absEntry: number
  lineNum: number
  itemCode: string
  description: string
  batch: string
  quantity: number
  docNumber: number
  docType: string
  obs: string
  status: any
  pack: number
  atempty: any
}

export interface Viagens {
  id: number
  name: string
  createDate: string
  userId: number
  selected: string,
}

export interface ViagemsListMobile {
  docNUm: number
  itemCode: string
  dscription: string
  vol: number
  usr: string
  pack: number
  destiny: string,
  packagE_NAME: string
  conferred: string
}

export interface VolumesListMobileV2 {
  id: number
  pack: string
  docNum: number
  lineNum: number
  itemCode: string
  dscription: string
  package: number
  carregado: string
  quantity: number
}


export interface ViagemsListMobileV2 {
  pack: string
  pedidos: number
  carregado: number
  embalagem: string
  itens: number
  destiny: string
  createDate: string
  userName: string
  observation?: string | null; // ✅ adiciona isso
}


export interface Line {
  itemCode: string
  cardName: string
  comments: string
  dscription: string
  quantity: number
  pickQuantity: number
  umv: string
  ume: string
  factor: number
  pickStatus: string
  address: string
  slpName: string
  commentsLine: string
  absEntry: number
  orderEntry: number
  tipoFrete?: string
  docNum: number
  orderLine: number
  obsqualidade?: string
  multiple?: number 
  toleranceSeparador: number
  toleranceSupervisor: number
}

export interface Pack //Volumes
{
    id: number,
    userId: number,
    username: string,
    status: string,
    createDate: string,
    destiny: string,
    itens: number,
    package_Name?: string
    selected?: boolean
}

export interface Item {
  whsCode: string
  batch: string
  disponivel: number
  ume: string
  qtdeKg: number
  pickedUMV?: number
  pickedUME?: number
  pickedPCK?: number
  confirmed?: boolean
  userId?: number
   selectedLot: any | null
  selectedQty: any | null
  _tmpQty: any | null
  _tmpLot: any | null
  _selQtd: any | null
  _selLote: any | null
}

  export interface DashBoardMobile {
  onePercent?: ObjectDashboard
  markupDay?: ObjectDashboard
  ordersDayMoney?: ObjectDashboard
  ordersDayKG?: ObjectDashboard
  orderCreated?: ObjectDashboard
  conversation?: ObjectDashboard
  sellersWithOrders?: ObjectDashboard
  budget?: ObjectDashboard
}


export interface ObjectDashboard {
  value?: number
  description?: number
}

export interface Login {
  allowAccess?: string
  userProfile?: string
  email?: string
  slpName?: string
  motorista?: string
  slpCode?: string
  sessionId?: string
}

export interface OnePercentObjDetails {
  serial: string
  cardName: string
  amount: number
}