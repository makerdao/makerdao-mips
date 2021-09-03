import { ComponentMip } from "./component-mip";
import { ISubsetDataElement } from "./subset";

export interface IMip {
  _id?: string;
  title?: string;
  proposal?: string;
  filename?: string;
  mipName?: string;
  paragraphSummary?: string;
  sentenceSummary?: string;
  mip?: number;
  status?: string;
  mipFather?: string;
  children?: IMip[];
  subset?: string;
  expanded?: boolean;
  subproposalsGroup?: any;
  subsetRows?: ISubsetDataElement[];
  expandedSummary?: boolean;
  showArrowExpandChildren?: boolean;
  components: ComponentMip[]
}
