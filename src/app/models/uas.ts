export interface UAS {
    id: number;
    code: string;
    address: string;
    batch: string;
    unitmeasure: string;
    quantity: number;
    status: boolean;
    requested?: number;
}

export interface OrdersCheckout {
    docNum: number,
    clientName: string,
    packing: number,
    tolerance: number
    approved: string
}

export interface SalesOrderItensPick {
    itemCode: string;
    lineNum: number;
    um: string;
    uaChanged: string;
    uaNew: string;
    description: string;
    quantity: number;
    picked: number;
    factor: number;
    forms: boolean;
    questions: string[];
    formquestions: FormQuestions[];
    obs: string;
    address: string;
    uas: UAS[];
}

export interface FormQuestions {
    id: number;
    question: string;
    type: string;
    resolution: string;
}


export interface SalesOrderDetails {
    docNum: number;
    cardName: string;
    obs: string;
    qtyItens: number;
    conferred: number;
    pack: number;
    pending: number;
    itens: SalesOrderDetailsItens[];
}

export interface SalesOrderDetailsItens {
    itemCode: string;
    lineNum: number;
    description: string;
    quantity: number;
    um: string;
    status: string;
    comments: string;
    address: string;
    factor: number;
}

export interface PackId
{
  idPack: string
  docEntry: number
}

export interface Disponiveis {
    pickList:number
    pickEntry: number
    itemCode: string
    dscription: string
    disponivel: number
    inicial: number
    quantity: number
    docNumber: number
    objType: string
    saldo: number
    batch: string
    pecas: number
    weight: number
}

export interface Pack {
    id: number
    userId: number
    docnumber: number,
    username: string
    status: string
    createDate: string
    destiny: string
    itens: number
    package_Name: string
    weight?: number
    packItens: PackItenv2[]
    tipoFrete?: string
    perfil?: string
}

export interface ReserveV1Documents
{
    doc: number
    itens: number
}

export interface VolumesItem{
volume: number
pecas: number
}

export interface ReversePackItem {
  docEntry: number;
  docNum: number;
  absEntry: number;
  lineNum: number;
  itemCode: string;
  description: string;
  quantityUmv: number;
  userName: string;
  batch: string;
  status: string;
}


export interface ReserveV1 {
    id: number
    idPack: number
    itemCode: string
    description: string
    batch: string
    qtde: number
    obs: string
  }

  export interface CutsBase {
  id: number
  docNum: number
  docEntry: number
  cardName?: string,
  itemCode: string
  lineNum: number
  orderLine: number
  description: string
  batch: string
  pecas: number
  pecasCut?: number,
  packCut?: number,
  lineStatus: string
  freeTxt: string
  vendedor: string
  package: number
  usuario: string
  pickList: number
  manutencao?: boolean
}
  
export interface PackItenv2 {
    id: number
    idPack: number
    absEntry: number
    lineNum: number
    itemCode: string
    description: string
    batch: string
    pack: number
    quantity: number
    docNumber: number
    docType: string
    obs: string
    atempty?: number,
    qty?: number, //only conference
    obsconferente?: string,
    obspedido?: string,
    obsvendedor?: string,
    obsqualidade?: string,
    obsseparador?: string
    selected?: boolean
    tipoFrete?: string 
}

export interface PickingList {
    itemCode?: string,
    cardName?: string,
    comments?: string,
    objType: string,
    dscription?: string,
    quantity?: number,
    pickQuantity?: number,
    umv: string,
    ume: string,
    factor: 1,
    pickStatus: string,
    pickStatusLine: string,
    pickLine: number,
    whsCode: string,
    address: string,
    slpName: string,
    absEntry: number,
    orderEntry: number,
    destiny: string,
    orderLine: number
}

export interface PackFinsh
{
  idPack: number,
  absEntry: number,
  idPackLine: number,
  lineNum?: number
  pck: number,
  userId?: number
}

export interface ReversePackAllList {
  doc: number
  itens: number
}

