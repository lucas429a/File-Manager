import { TagDataService } from "../../services/data/TagDataService";
import { FileProcessorBase } from "../base/FileProcessorBase";
import { FileParser } from "../utils/FileParser";

export class PernambucanasFileProcessor extends FileProcessorBase {
  private fileParser: FileParser;
  private tagDataService: TagDataService;

  constructor() {
    super();
    this.fileParser = new FileParser();
    this.tagDataService = new TagDataService();
  }

  async processFiles(
    files: Express.Multer.File[],
    companyCode: number
  ): Promise<any> {
    const organizedFiles = await this.organizeFiles(files);
    const result = await this.fileParser.readAndParseFile(
      organizedFiles.pernambucanastag,
      {
        typeTag: "pernambucanastag",
        codeCompany: companyCode,
      }
    );
    return await this.tagDataService.saveToTagsTable(
      result.parsedData,
      companyCode,
      "pernambucanastag"
    );
  }

  async organizeFiles(files: Express.Multer.File[]): Promise<any> {
    if (!files || files.length !== 1) {
      throw new Error(
        "Only one file is necessary to process Pernambucanas."
      );
    }

    return { pernambucanastag: files[0] };
  }
}
