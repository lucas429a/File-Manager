export type PernambucanasTagData = {
  CENTRO_FATURAMENTO: string;
  FORNECEDOR: string;
  N_PEDIDO: string;
  COD_DCO: string;
  CICLOVIDA: string;
  DEPARTAMENTO: string;
  DES_ENDERECO: string;
  ITEM: string;
  FAIXA: string;
  SUBSEGMENTO: string;
  QTD: string;
  DESCRICAO: string;
};

type Input = {
  fixedWidthData: string;
};

export class PernambucanasTagConverter {
  public parse(input: Input): PernambucanasTagData[] {
    const fileContent = input.fixedWidthData;

    if (!fileContent || fileContent.length === 0) {
      throw new Error(
        "Data not found in file Pernambucanas."
      );
    }

    const tags: PernambucanasTagData[] = [];
    const tag = this.parseFixedWidth(fileContent);
    if (tag) {
      tags.push(tag);
    }

    if (tags.length === 0) {
      throw new Error(
        "No valid data found in file pernambucanas."
      );
    }

    return tags;
  }

  private parseFixedWidth(line: string): PernambucanasTagData | null {
    try {
      const centroFaturamento = line.substring(2, 16).trim();
      const fornecedor = line.substring(16, 46).trim();
      const nPedido = line.substring(46, 56).trim();
      const codDco = line.substring(58, 66).trim();
      const faixa = line.substring(56, 58).trim();
      const ciclovida = line.substring(66, 74).trim();
      const departamento = line.substring(74, 98).trim();
      const desEndereco = line.substring(112, 237).trim();
      const subsegmento = line.substring(302, 309).trim();
      const qtd = line.substring(309, 312).trim();
      const item = line.substring(312, 325).trim();
      const descricao = line.substring(325, 364).trim();

      if (!centroFaturamento && !fornecedor && !nPedido) {
        return null;
      }

      return {
        CENTRO_FATURAMENTO: centroFaturamento || "",
        FORNECEDOR: fornecedor || "",
        N_PEDIDO: nPedido || "",
        COD_DCO: codDco || "",
        CICLOVIDA: ciclovida || "",
        DEPARTAMENTO: departamento || "",
        DES_ENDERECO: desEndereco || "",
        ITEM: item || "",
        FAIXA: faixa || "",
        QTD: qtd || "",
        DESCRICAO: descricao || "",
        SUBSEGMENTO: subsegmento || "",
      };
    } catch (error) {
      return null;
    }
  }
}
