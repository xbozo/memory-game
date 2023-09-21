export type GridItemType = {
    item: number | null;        // como o grid é criado em 2 etapas (criação e preenchimento) deve-se aceitar null pra evitar problemas
    shown: boolean;
    permanentShown: boolean; 
}