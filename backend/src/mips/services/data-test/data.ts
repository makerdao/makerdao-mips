import { Filters } from "@app/mips/dto/query.dto";
import { Component, Language, MIP, Reference } from "@app/mips/entities/mips.entity";
import { IGitFile, IPreamble, ISynchronizeData } from "@app/mips/interfaces/mips.interface";
import { RequestDocument } from "graphql-request";
import { PullResult } from "simple-git";
const faker = require("faker");

faker.seed('Data');

export const mipNumber_1 = faker.datatype.number({ min: 1, max: 10 });
export const mipNumber_2 = faker.datatype.number({ min: 1, max: 10 });

const filename: string = `MIP${mipNumber_1}/MIP${mipNumber_1}.md`;
const sentenceSummary: string = faker.lorem.paragraph();
export const paragraphSummaryMock: string = faker.lorem.paragraph();
export const authorMock: string[] = [`${faker.name.firstName()} ${faker.name.lastName()}`, `${faker.name.firstName()} ${faker.name.lastName()}`,];
export const contributorsMock: string[] = [faker.random.word()];
export const dateProposedMock: string = faker.date.past('YYYY-MM-DD').toString();
export const dateRatifiedMock: string = faker.date.past('YYYY-MM-DD').toString();
export const dependenciesMock: string[] = [faker.random.word()];
export const votingPortalLinkMock: string = faker.internet.url();
const mip = mipNumber_1;
export const replacesMock: string = faker.random.word();
export const statusMock: string = faker.random.arrayElement(['Accepted', 'Rejected', 'RFC']);
export const titleMock: string = faker.lorem.paragraph();
export const typesMock: string = faker.random.word();
export const forumLinkMock: string = faker.random.word();
export const tagsMock: string = faker.random.word();
export const extraMock: string = faker.random.word();

// ParseMIPsCommand unit test
export const errorDropMock: string = faker.lorem.paragraph();

// ParseQueryService unit tests
export const tagsMock_1: string = faker.random.word();
export const tagsMock_2: string = faker.random.word();
export const tagsMock_3: string = faker.random.word();

// MIPsController unit tests
export const limitMock: string = faker.datatype.number();
export const pageMock: string = faker.datatype.number();
export const orderMock: string = faker.random.word();
export const selectMock: string = faker.random.word();
export const languageMock: Language = faker.random.arrayElement([Language.English, Language.Spanish]);
export const searchMock: string = faker.random.word();
export const fieldMock: string = faker.random.word();
export const valueMock: string = faker.random.word();
export const filtersMock: Filters = {
  contains: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  notcontains: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  notequals: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  equals: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  inarray: [{
    field: faker.random.word(),
    value: [faker.random.word(), faker.random.word()],
  }],
};
export const metaVarsMock = [{
  language: languageMock.toString(),
  translations: languageMock.toString(),
}];
export const pullRequestMock = {
  name: faker.random.word(),
}
export const mipNameMock: string = faker.random.word();
export const parseResultMock: boolean = faker.datatype.boolean();
export const requestCallBackMock = {
  headers: {
    "x-hub-signature": faker.random.word(),
  },
  body: {
    field: faker.random.word(),
  },
};
export const requestCallBackNotHeaderMock = {
  headers: {},
  body: {
    field: faker.random.word(),
  },
};

// MIPsService unit tests
export const searchFieldMock: string = faker.random.word();
export const parseMock: string = faker.random.word();
export const builtFilterMock = {
  language: languageMock,
  [fieldMock]: {
    $regex: new RegExp(`${valueMock}`),
    $options: "i",
  },
};
export const builtContainsFilterMock = {
  [filtersMock.contains[0].field]: {
    $regex: new RegExp(`${filtersMock.contains[0].value}`),
    $options: "i",
  },
};
export const builtEqualsFilterMock = {
  [filtersMock.equals[0].field]: filtersMock.equals[0].value,
};
export const builtInArrayFilterMock = {
  [filtersMock.inarray[0].field]: {
    $in: [filtersMock.inarray[0].value[0], filtersMock.inarray[0].value[1]],
  },
};
export const builtNotContainsFilterMock = {
  [filtersMock.notcontains[0].field]: {
    $not: {
      $regex: new RegExp(`${filtersMock.notcontains[0].value}`),
      $options: "i",
    },
  },
};
export const builtNotEqualFilterMock = {
  [filtersMock.notequals[0].field]: {
    $ne: filtersMock.notequals[0].value,
  },
};
export const tagMock: string = faker.random.word();
export const tagsQueryMock = {
  type: 'LITERAL',
  name: '#' + tagMock,

};
export const builtTagFilterMock = {
  tags: {
    $in: [tagMock]
  }
};
export const statusQueryMock = {
  type: 'LITERAL',
  name: '@' + statusMock,
};
export const builtStatusFilterMock = {
  status: {
    $regex: new RegExp(statusMock),
    $options: "i",
  },
};
export const orQueryMock = {
  type: 'OPERATION',
  op: 'or',
  left: [
    tagsQueryMock,
    statusQueryMock,
  ],
};
export const builtOrFilterMock = {
  $or: [
    builtTagFilterMock,
    builtStatusFilterMock,
  ],
};
export const notTagQueryMock = {
  type: 'OPERATION',
  op: 'not',
  left: '#' + tagMock,
};
export const builtNotTagFilterMock = {
  tags: {
    $nin: [tagMock],
  }
};
export const notStatusQuery = {
  type: 'OPERATION',
  op: 'not',
  left: '@' + statusMock,
};
export const builtNotStatusFilterMock = {
  status: {
    $not: {
      $regex: new RegExp(statusMock),
      $options: "i",
    },
  },
};
export const andQueryMock = {
  type: 'OPERATION',
  op: 'and',
  left: [
    orQueryMock,
    notTagQueryMock,
    notStatusQuery],
};
export const builtAndFilterMock = {
  $and: [
    builtOrFilterMock,
    builtNotTagFilterMock,
    builtNotStatusFilterMock,
  ]
};
export const mipToBeSearcheableMock: MIP = {
  mipName: mipNameMock,
  filename: faker.random.word(),
  proposal: faker.random.word(),
  title: titleMock,
  sectionsRaw: [faker.random.word()],
} as any;
export const mipSearcheableMock: MIP = {
  ...mipToBeSearcheableMock,
  mipName_plain: mipNameMock,
  filename_plain: mipToBeSearcheableMock.filename,
  proposal_plain: mipToBeSearcheableMock.proposal,
  title_plain: titleMock,
  sectionsRaw_plain: mipToBeSearcheableMock.sectionsRaw,
} as any;
export const fileNameMock: string = faker.random.word();
export const proposalMock: string = faker.random.word();
export const deleteMipresult = {
  n: faker.datatype.number(),
  ok: faker.datatype.number(),
  deletedCount: faker.datatype.number(),
};

// PullRequestService unit test
export const countPullRequestMock: number = faker.datatype.number();
export const insertManyMock: boolean = faker.datatype.boolean();

// SimpleGitService unit test
export const cloneMessageMock: string = faker.random.word();
export const pullMock: PullResult = {
  files: [faker.random.word()],
  created: [faker.random.word()],
  deleted: [faker.random.word()],
  deletions: null,
  insertions: null,
  remoteMessages: null,
  summary: null,
};
export const pullErrorMock: string = faker.random.word();
export const hashMock: string = faker.random.word();
export const rawResultMock: string = hashMock + ' ' + hashMock + '\t' + fileNameMock + '\t' + fileNameMock + '.md';
export const longerRawResultMock: string = faker.random.word() + ' ' + rawResultMock;
export const getFilesResultMock = [
  {
    filename: fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
  {
    filename: fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
];
export const getLongerFilesResultMock = [
  {
    filename: fileNameMock + ' ' + fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
  {
    filename: fileNameMock + ' ' + fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
];
export const languageFileNameMock: string = "I18N/" + languageMock + '/';
export const readFileResultMock: string = faker.random.word();
export const translationMetaVarsMock = [{
  language: Language.English,
  translations: readFileResultMock,
}];
export const errorReadFileMock: string = faker.random.word();

// ParseMIPsService unit tests
export const mipMock = {
  filename: faker.random.word(),
  hash: faker.random.word(),
  language: faker.random.arrayElement([Language.English, Language.Spanish]),
  file: faker.random.word(),
  _id: faker.datatype.uuid(),
};
export const synchronizeDataMock: ISynchronizeData = {
  creates: 1,
  deletes: 1,
  updates: 1,
};
export const gitFileMock: IGitFile = {
  ...mipMock,
  language: faker.random.arrayElement([Language.English, Language.Spanish]),
};
export const mipMapMock: Map<string, IGitFile> = new Map();
export const mapKeyMock: string = faker.random.word();
mipMapMock.set(mapKeyMock, gitFileMock);
export const edgesMock: string = faker.random.word();
export const totalCountMock: number = faker.datatype.number({ min: 2, max: 4 });
export const countMock: number = faker.datatype.number({ min: 1, max: totalCountMock - 1 });
export const headingOutComponentSummaryParsed: string = `MIP${mipNumber_1}c13 is a Process MIP component that allows the removal of core personnel using a subproposal. [MIP${mipNumber_1}c13](mips/details/MIP${mipNumber_1}#MIP${mipNumber_1}c13 \"smart-Component\") subproposals have the following parameters:`;
export const componentSummaryParsed: string = `## Component Summary ${mipNumber_1}\n\n`;
export const componentSummaryParsed_1: string = `[MIP${mipNumber_1}c13: Core Personnel Offboarding](mips/details/MIP${mipNumber_1}#MIP${mipNumber_1}c13 "NON-SMART-LINK")  ` 
+ `\nA process component that defines the process to remove personnel from the MIP Editor or Governance Facilitator roles.`;
export const titleParsed: string = `# MIP${mipNumber_1}: ${titleMock}\n\n`;
export const filesGitMock: IGitFile[] = [{
  ...mipMock,
  filename,
}];
export const mipWithoutNameMock = {
  ...mipMock,
  mip: undefined,
  mipName: undefined,
};
export const referenceMock: Reference = {
  link: faker.internet.url(),
  name: faker.random.word(),
};
export const sectionNameMock: string = `MIP${mipNumber_1}c${faker.datatype.number({ min: 1, max: 30 })}`;
export const markedListMock: any[] = [
  {
    type: 'heading',
    depth: 1,
    text: faker.random.word(),
  },
  {
    type: 'heading',
    depth: 2,
    text: `${sectionNameMock}:`,
  }
];
export const parseStringMock: string = `MIP#: ${mipNumber_1}`;
export const openIssuemock: string = faker.random.word();
export const components: Component[] = [
  {
    cBody: "Defines several concepts that are important for understanding the MIPs process.",
    cName: `MIP${mipNumber_1}c1`,
    cTitle: "Definitions of the Maker Improvement Proposal Framework"
  },
  {
    cBody: "Discusses some core principles that all MIPs should aim to follow.",
    cName: `MIP${mipNumber_1}c2`,
    cTitle: "Core Principles"
  },
  {
    cBody: "Lays out how a MIP is created and moves through the process to become Accepted or Rejected.",
    cName: `MIP${mipNumber_1}c3`,
    cTitle: "The MIP Lifecycle"
  },
  {
    cBody: "Discusses the use of components to compartmentalize and organise MIPs",
    cName: `MIP${mipNumber_1}c4`,
    cTitle: "MIP Components and MIP Component Types"
  },
  {
    cBody: "Discusses how MIPs can be replaced and the steps to be taken to maintain dependencies.",
    cName: `MIP${mipNumber_1}c5`,
    cTitle: "MIP Replacement Process"
  },
  {
    cBody: "A component that defines how to include external materials inside MIPs.",
    cName: `MIP${mipNumber_1}c6`,
    cTitle: "Supporting Materials"
  },
  {
    cBody: "Defines the MIP templates for both General and Technical MIPs.",
    cName: `MIP${mipNumber_1}c7`,
    cTitle: "MIP Templates"
  },
  {
    cBody: "Defines the core roles that the MIPs process requires to operate successfully.",
    cName: `MIP${mipNumber_1}c8`,
    cTitle: `MIP${mipNumber_1} Domain Role Dependencies`
  },
  {
    cBody: "List of of personnel currently occupying core roles.",
    cName: `MIP${mipNumber_1}c9`,
    cTitle: "Core Personnel Role List"
  },
  {
    cBody: "A component that defines the responsibilities, criteria and grounds for removal of the MIP Editor role.",
    cName: `MIP${mipNumber_1}c10`,
    cTitle: "MIP Editor Role"
  },
  {
    cBody: "A component that defines the responsibilities, criteria and grounds for removal of the Governance Facilitator role.",
    cName: `MIP${mipNumber_1}c11`,
    cTitle: "Governance Facilitator Role"
  },
  {
    cBody: "A process component that defines the process to add personnel to the MIP Editor or Governance Facilitator roles.",
    cName: `MIP${mipNumber_1}c12`,
    cTitle: "Core Personnel Onboarding"
  },
  {
    cBody: "A process component that defines the process to remove personnel from the MIP Editor or Governance Facilitator roles.",
    cName: `MIP${mipNumber_1}c13`,
    cTitle: "Core Personnel Offboarding"
  }
];
export const componentSummary: string = `**MIP${mipNumber_1}c1: Definitions of the Maker Improvement Proposal Framework**  \n` +
  `Defines several concepts that are important for understanding the MIPs process.\n` +
  `\n` +
  `**MIP${mipNumber_1}c2: Core Principles**  \n` +
  `Discusses some core principles that all MIPs should aim to follow.\n` +
  `\n` +
  `**MIP${mipNumber_1}c3: The MIP Lifecycle**  \n` +
  `Lays out how a MIP is created and moves through the process to become Accepted or Rejected.\n` +
  `\n` +
  `**MIP${mipNumber_1}c4: MIP Components and MIP Component Types**  \n` +
  `Discusses the use of components to compartmentalize and organise MIPs\n` +
  `\n` +
  `**MIP${mipNumber_1}c5: MIP Replacement Process**  \n` +
  `Discusses how MIPs can be replaced and the steps to be taken to maintain dependencies.\n` +
  `\n` +
  `**MIP${mipNumber_1}c6: Supporting Materials**\n` +
  `A component that defines how to include external materials inside MIPs.\n` +
  `\n` +
  `**MIP${mipNumber_1}c7: MIP Templates**  \n` +
  `Defines the MIP templates for both General and Technical MIPs.\n` +
  `\n` +
  `**MIP${mipNumber_1}c8: MIP${mipNumber_1} Domain Role Dependencies**  \n` +
  `Defines the core roles that the MIPs process requires to operate successfully.\n` +
  `\n` +
  `**MIP${mipNumber_1}c9: Core Personnel Role List**  \n` +
  `List of of personnel currently occupying core roles.\n` +
  `\n` +
  `**MIP${mipNumber_1}c10: MIP Editor Role**  \n` +
  `A component that defines the responsibilities, criteria and grounds for removal of the MIP Editor role.\n` +
  `\n` +
  `**MIP${mipNumber_1}c11: Governance Facilitator Role**  \n` +
  `A component that defines the responsibilities, criteria and grounds for removal of the Governance Facilitator role.\n` +
  `\n` +
  `**MIP${mipNumber_1}c12: Core Personnel Onboarding**  \n` +
  `A process component that defines the process to add personnel to the MIP Editor or Governance Facilitator roles.\n` +
  `\n` +
  `**MIP${mipNumber_1}c13: Core Personnel Offboarding**  \n` +
  `A process component that defines the process to remove personnel from the MIP Editor or Governance Facilitator roles.\n` +
  `\n` +
  `\n`;
export const mipFile =
  `# MIP${mipNumber_1}: ${titleMock}\n\n## Preamble` +
  `\n${"```"}\nMIP#: ${mipNumber_1}\nTitle: ${titleMock}\nAuthor(s)` +
  `: ${authorMock[0]}, ${authorMock[1]}\nForum URL: ${forumLinkMock}\nTags: ${tagsMock}\nContributors` +
  `: ${contributorsMock}\nType: ${typesMock}\nRatification Poll URL: ${votingPortalLinkMock}\nStatus: ${statusMock} \nDate Proposed: ${dateProposedMock}` +
  `\nDate Ratified: ${dateRatifiedMock}\nExtra: ${extraMock}\nDependencies: ${dependenciesMock}\nReplaces: ${replacesMock}\n` +
  `${"```"}\n## References\n**[General-MIP-Template.md](General-MIP-Template.m` +
  `d)**  \n**[Technical-MIP-Template.md](Technical-MIP-Template.md)**  \n` +
  `**[MIP${mipNumber_1}c12-Subproposal-Template.md](MIP${mipNumber_1}c12-Subproposal-Template.md)**` +
  `  \n**[MIP${mipNumber_1}c13-Subproposal-Template.md](MIP${mipNumber_1}c13-Subproposal-Template.m` +
  `d)**  \n\n## Sentence Summary\n\n${sentenceSummary}\n\n## Paragraph Summary\n\n${paragraphSummaryMock}\n\n## Compo` +
  `nent Summary ${mipNumber_1}\n\n**MIP${mipNumber_1}c1: Definitions of the Maker Improvement Proposa` +
  `l Framework**  \nDefines several concepts that are important for under` +
  `standing the MIPs process.\n\n**MIP${mipNumber_1}c2: Core Principles**  \nDiscusses` +
  ` some core principles that all MIPs should aim to follow.\n\n**MIP${mipNumber_1}c3:` +
  ` The MIP Lifecycle**  \nLays out how a MIP is created and moves throug` +
  `h the process to become Accepted or Rejected.\n\n**MIP${mipNumber_1}c4: MIP Compone` +
  `nts and MIP Component Types**  \nDiscusses the use of components to co` +
  `mpartmentalize and organise MIPs\n\n**MIP${mipNumber_1}c5: MIP Replacement Process*` +
  `*  \nDiscusses how MIPs can be replaced and the steps to be taken to m` +
  `aintain dependencies.\n\n**MIP${mipNumber_1}c6: Supporting Materials**\nA component` +
  ` that defines how to include external materials inside MIPs.\n\n**MIP${mipNumber_1}` +
  `c7: MIP Templates**  \nDefines the MIP templates for both General and ` +
  `Technical MIPs.\n\n**MIP${mipNumber_1}c8: MIP${mipNumber_1} Domain Role Dependencies**  \nDefine` +
  `s the core roles that the MIPs process requires to operate successfull` +
  `y.\n\n**MIP${mipNumber_1}c9: Core Personnel Role List**  \nList of of personnel cur` +
  `rently occupying core roles.\n\n**MIP${mipNumber_1}c10: MIP Editor Role**  \nA comp` +
  `onent that defines the responsibilities, criteria and grounds for remo` +
  `val of the MIP Editor role.\n\n**MIP${mipNumber_1}c11: Governance Facilitator Role*` +
  `*  \nA component that defines the responsibilities, criteria and groun` +
  `ds for removal of the Governance Facilitator role.\n\n**MIP${mipNumber_1}c12: Core ` +
  `Personnel Onboarding**  \nA process component that defines the process` +
  ` to add personnel to the MIP Editor or Governance Facilitator roles.\n` +
  `\n**MIP${mipNumber_1}c13: Core Personnel Offboarding**  \nA process component that ` +
  `defines the process to remove personnel from the MIP Editor or Governa` +
  `nce Facilitator roles.\n\n\n## Motivation\n\nMakerDAO is evolving into` +
  ` an organization that is trustless, fully decentralized, open-sourced,` +
  ` and self-sustainable. In order to further enable this gradual evoluti` +
  `on while maintaining governance functionality both during this process` +
  ` and after the dissolution of the Maker Foundation, Maker will be gove` +
  `rned using Maker Improvement Proposals (MIPs).\n\nThe purpose of the M` +
  `IPs Framework is to open up the ability to improve Maker Governance an` +
  `d the Maker Protocol to anyone in the community.\n\nBy empowering the ` +
  `participation of the community and other stakeholders to have a standa` +
  `rd approach to proposing improvements, specifications, or process and ` +
  `state changes, the goal is to enable organic growth that will in turn ` +
  `bring MakerDAO closer to self-sustainability.\n\nIn order for MIPs to ` +
  `be functional they need to comply with a basic standard outlining thei` +
  `r internal structure and external dependencies. This standard is MIPs ` +
  `described in MIP${mipNumber_1}, the Maker Improvement Proposal Framework.\n\n\n## S` +
  `pecification / Proposal Details\n\n### MIP${mipNumber_1}c1: Definitions of the Make` +
  `r Improvement Proposal Framework\n\n- **Maker Improvement Proposals (M` +
  `IPs):** are the preferred mechanism for improving Maker Governance and` +
  ` the Maker Protocol. Through an open and documented process, the goal ` +
  `is to collect as much community feedback as possible and reach the bro` +
  `adest possible consensus on how the Maker Protocol should evolve. A pr` +
  `oposal clearly defines how and why Maker Governance or the Maker Proto` +
  `col should be changed and ensures that this improvement is introduced ` +
  `in a responsible way, respecting the highest quality, security and com` +
  `munity standards.\n-   **MIP${mipNumber_1}:** The genesis MIP defining the MIPs fra` +
  `mework. This MIP defines all of the processes that are required for th` +
  `e implementation of future MIPs. \n-   **MIP Sets:** A MIP set is a gr` +
  `oup of several MIPs that are interdependent, in which without the enti` +
  `re set of MIPs existing, one or more MIPs in the Set become inconsiste` +
  `nt, invalid or nonsensical. The intention is for MIP sets to together ` +
  `describe a single complex behaviour in such a way that allows each ind` +
  `ividual MIP to be written following the principle of Specificity but w` +
  `ork together as a cohesive modular whole.\n-   **MIP Types:** MIPs are` +
  ` separated into a number of types, and each type has its own list of M` +
  `IPs and processes.\n-   **Process MIP:** Process MIPs are used to crea` +
  `te and define a specific recurring process that the Maker Protocol or ` +
  `Governance will employ.\n-   **Subproposals (SPs):** A subproposal is ` +
  `an instance of a sub-process that has been defined by a specific MIP. ` +
  `Subproposals are named in the following format: MIP${mipNumber_1}-SP1 (where MIP${mipNumber_1} i` +
  `s a Process MIP and MIP${mipNumber_1}-SP1 is a subproposal under that Process MIP) ` +
  ` \n-   **Minimum Feedback Period:** The minimum amount of time within ` +
  `which the community is able to give feedback in response to a proposed` +
  ` MIP.  \n-   **Minimum Frozen Period:** The minimum amount of time dur` +
  `ing which a MIP must remain unchanged (frozen) before it can be submit` +
  `ted for ratification/implementation.\n-   **Governance Facilitator(s):` +
  `** Governance Facilitators are tasked with ensuring the smooth operati` +
  `on of the governance process. This involves a wide range of activities` +
  `, anything from general administration to signals gathering to governa` +
  `nce scheduling.\n-  **MIP Editor(s):** Enforce the administrative and ` +
  `editorial aspects of the overall MIPs process and program. The expecta` +
  `tion is that the program will start out with an interim editor from th` +
  `e Maker Foundation and that others will join later.\n-   **Domain Team` +
  `s**: Domain Teams work for the DAO, are onboarded through governance a` +
  `nd are paid by the Protocol. Domain teams perform defined duties for t` +
  `he DAO, such as overseeing critical processes and mitigating risk. The` +
  `se teams consist of but are not limited to Risk, Oracles, Smart Contra` +
  `cts or Legal. \n    \n\n---\n### MIP${mipNumber_1}c2: Core Principles\n\n 1. **Spec` +
  `ificity:** A MIP needs to define and address a specific behaviour or s` +
  `ingle responsibility. MIPs with many different behaviours or responsib` +
  `ilities will not be allowed and must be split up into multiple MIPs.\n` +
  `\t - This mitigates the risk of having “fine print” or potential attac` +
  `ks hidden in large, complex MIPs.\n 2. **Completeness:** A MIP or MIP ` +
  `Set is complete if it has all the necessary or appropriate parts that ` +
  `cover a whole behaviour and avoids being only a specific part of a gre` +
  `ater whole.\n\t - This is important for both understandability, readab` +
  `ility and accessibility of MIPs.\n3.  **Avoid overlap:** Multiple MIPs` +
  ` should not implement the same type of behaviour independently. For in` +
  `stance, there should not be two separate but interchangeable ways to d` +
  `o collateral onboarding.\n\t- This way the primary and best-understood` +
  ` process for each particular behaviour will be fairly available to eve` +
  `ryone, without risking having a knowledge gap that makes it possible f` +
  `or some actors with better access to information to use different and ` +
  `potentially better processes\n4. **Clarity:** A MIP must not have equa` +
  `lly valid conflicting interpretations. MIP Authors and MIP Editors mus` +
  `t strive to reduce ambiguity. A MIP must be as clear and easy to under` +
  `stand as possible.\n\t- Any ambiguous MIPs are likely to cause content` +
  `ion or confusion in the future. Making everything as clear as possible` +
  ` also aids readability and helps to mitigate the risk of hidden attack` +
  `s.\n5. **Brevity:** A MIP must be as short as possible, including only` +
  ` that which is essential given the other core principles.\n\t- The sho` +
  `rter MIPs are the more likely participants in governance are to read t` +
  `hem in full. This also serves to reduce the surface area for hidden at` +
  `tacks.\n\t\n---\n\n### MIP${mipNumber_1}c3: The MIP Lifecycle\n\n**The MIP Lifecycl` +
  `e Flow and MIP Statuses**\n\n![mip_life_cycle](https://user-images.git` +
  `hubusercontent.com/32653033/79086728-19d93900-7d0b-11ea-8086-c255d9190` +
  `96c.png)\n\n\n**MIP Status Criteria**  \n\n**1. Conception:** The life` +
  `cycle of a MIP begins when the MIP proposal is posted on the Maker for` +
  `um. However, in order for a MIP to move to the next stage, it needs to` +
  ` satisfy the transition criteria (1) described below:\n\n-   Submitted` +
  ` to the MIPs Discourse Forum.\n-   Submitted to the MIPs Github reposi` +
  `tory (with a Pull Request created by the MIP Author or MIP Editor).\n-` +
  `   The format must follow the appropriate MIP Template for its type.\n` +
  `-   MIPs must be original or replacement versions of older MIPs (No re` +
  `peats allowed).\n\n**2. Approved by MIP Editor(s):** This phase of a M` +
  `IP’s life cycle is when the MIP Editor(s) confirms that the proposed M` +
  `IP follows the correct structure and editorial criteria defined in the` +
  ` MIP template. If the criteria is not met, the MIP Editor(s) will prov` +
  `ide an explanation to the MIP Author as to why and allow them to make ` +
  `the appropriate changes before reconsideration. If the criteria have b` +
  `een met, the MIP Editor(s) performs the following actions:\n    \n-   ` +
  `The MIP is approved by a MIP Editor(s) and is assigned a formal MIP nu` +
  `mber.\n-   The PR is merged in by a MIP Editor(s).\n\n**3. Request for` +
  ` Comments (RFC):** This phase is when a MIP goes through a formal revi` +
  `ew period, including feedback from the community, further drafting and` +
  ` additions. The timeline for the RFC phase is defined by its Feedback ` +
  `Period and Frozen Period. In order to move to the next phase, it needs` +
  ` to satisfy the transition criteria listed below:\n     \n - MIP Autho` +
  `r finalizes changes of the MIP, based on community feedback.\n - MIPs ` +
  `have a Feedback Period of 3 months. The RFC phase lasts at least 3 mon` +
  `ths before the MIP can move to the next phase. \n - MIPs have a Frozen` +
  ` Period of 1 month. MIPs must not have had any changes for the last 1 ` +
  `month before they move to the next phase.\n\n**4. Fulfilled Feedback P` +
  `eriod Requirements:** This status is given once the MIP has fulfilled ` +
  `the defined Feedback Period and Frozen Period. After the MIP has waite` +
  `d out its Feedback Period and Frozen Period, it’s ready for Formal Sub` +
  `mission. Note that the Feedback Period and Frozen Period can overlap.` +
  `\n\n**5. Formal Submission (FS):** This phase is when MIP Authors subm` +
  `it their complete MIP(s) to the Governance cycle by posting it to the ` +
  `formal submission forum category within the formal submission window o` +
  `f a governance cycle.\n    - A MIP can be re-submitted to the formal s` +
  `ubmission process a maximum of 2 additional times (3 total), without h` +
  `aving to go through phase 1- 4 again, if it failed to pass due to legi` +
  `timate external reasons (e.g. got bundled in a governance poll or exec` +
  `utive vote with a controversial proposal - subject to the governance f` +
  `acilitators judgement).\n  \n**6. Approved by the Governance Facilitat` +
  `or(s):** This phase is when the MIP must be formally approved by the G` +
  `overnance Facilitators.   \n\n- Once approved by the Governance Facili` +
  `tator, the MIP will be included in the inclusion poll of the Governanc` +
  `e cycle.\n- If the MIP is not approved by the Governance Facilitator, ` +
  `it may be reconsidered at a later date to enter the Governance cycle. ` +
  `\n    \n**7. Governance Cycle:** This phase is when MKR holders vote o` +
  `n whether to include the MIP in the governance poll, ultimately determ` +
  `ining whether or not the MIP can formally enter the governance cycle.` +
  `\n- Once approved for the governance poll, MKR holders determine wheth` +
  `er to accept or reject the package of proposals in the governance poll` +
  ` and finally to ratify the result in the executive vote.  \n\n**8. Exe` +
  `cutive Vote:** This phase is when the MIP becomes officially ratified ` +
  `or not. Determined by MKR holders, the executive vote ultimately accep` +
  `ts or rejects the MIP.  \n\n**9. Accepted/Rejected:** The Executive vo` +
  `te results in either acceptance or rejection of the MIP. If passed, th` +
  `e MIP is officially accepted and is given the accepted status. If the ` +
  `executive vote fails to pass before expiring, the MIP is rejected.\n- ` +
  `As described in phase 5, a rejected MIP, can be resubmitted, and in so` +
  `me cases (if it was rejected for provable extraneous explanation) may ` +
  `be allowed to enter the next Governance cycle immediately.  \n      \n` +
  `\n**Other MIP Statuses:**  \n     \n\n**Withdrawn:** when a MIP Author` +
  ` withdraws their MIP proposal, such as when:\n\n - A MIP may be withdr` +
  `awn at any point before it enters the Governance cycle. \n - Note that` +
  ` a withdrawn proposal can be taken over from the original Author with ` +
  `a simple transition facilitated by a MIP Editor(s) and the respective ` +
  `parties. If the original MIP Author ceases to be available, the MIP Ed` +
  `itor(s) may proceed with the transfer of Authors.\n\n**Deferred:** whe` +
  `n a proposal has been deemed as not ready or not a priority but can be` +
  ` re-proposed at a later date.\n-   Request for Comments (RFC) - Forum ` +
  `poll/signal request rejects a MIP Proposal.\n\n**Obsolete:** when a pr` +
  `oposal is no longer used or is out of date, such as:\n    \n-   A MIP ` +
  `is replaced with a new proposal.\n-   A MIP has been deferred for over` +
  ` 6 months.\n-   A MIP Author has abandoned the proposal and no person ` +
  `has communicated willingness to take over MIP Author responsibility.\n` +
  `-   A MIP has been replaced by a newer, more updated MIP Proposal.\n- ` +
  `  A MIP no longer makes sense to keep in consideration.\n    \n  \n**M` +
  `IP Status Change Process:**\n    \n\nA status change for a MIP is requ` +
  `ested by the MIP Author and will be reviewed by the MIP Editor(s) to s` +
  `ee if it meets the status criteria of the requested status change. If ` +
  `it does, the Editor(s) will change the status of the MIP and the Autho` +
  `r may proceed with the next stage of the process. If it does not, the ` +
  `MIP Editor(s) will revert with highlighted issues, and the Author must` +
  ` fix the highlighted issues before requesting another status change.\n` +
  `    \n---\n### MIP${mipNumber_1}c4: MIP Components and MIP Component Types\n\n\n**M` +
  `IP Components**\n\n- When necessary, MIPs can have multiple components` +
  ` if it needs to contain multiple units of logic to satisfy completenes` +
  `s. A MIP can also have only a single component.\n- MIP components are ` +
  `categorized by types, depending on what kind of logic they contain. MI` +
  `P components are named by their parent MIP. The abbreviation conventio` +
  `n MIPXcY is used to refer to these components (as seen in this documen` +
  `t).\n- A MIP component has one type or no types. \n\n\n**Component Typ` +
  `es**\n    \n-   **Process MIP Component**  \n      \n    **Summary:** ` +
  `The purpose of a Process MIP component is to shape a specific process ` +
  `flow for the Maker community to adopt and standardize with respect to ` +
  `how governance operates. This MIP component type helps streamline spec` +
  `ific processes in a transparent, open and traceable manner. A Process ` +
  `MIP will provide a publicly documented scope of a proposed process fra` +
  `mework as well as a detailed description of the subproposal structure.` +
  `  \n      \n    **Special Template:** N/A  \n      \n    **Important N` +
  `otes:**  \n\n\t-   A Process MIP component must define the Feedback Pe` +
  `riod and Frozen Period for its sub proposals.\n\t-   Sub proposals of ` +
  `Process MIP components with additional MIP Component types inherit the` +
  ` same types.  \n      \n    \n\n-   **Subproposals**  \n      \n    **` +
  `Summary:** A subproposal is an expedited process that is defined withi` +
  `n a MIP to serve as a definition of how to run a given process within ` +
  `the MIPs framework. \n\n- Subproposals require a template, a feedback ` +
  `period and a frozen period and are submitted using that template. Subp` +
  `roposals go through the MIPs process in the same way that full MIPs do` +
  `. The template, feedback period and frozen period for a set of subprop` +
  `osals are defined using a MIP component known as a Process component. ` +
  `Any MIP containing a Process Component gains the Process type.\n- The ` +
  `subproposal naming convention is MIPXcY-SPZ where Y is the Process Com` +
  `ponent that contains the subproposal template and X is the MIP contain` +
  `ing that component. This is important in order to delineate between di` +
  `fferent types of subproposal defined in the same MIP under different P` +
  `rocess components.\n   \n**Special Template:** N/A  \n  \n---\n\n### M` +
  `IP${mipNumber_1}c5: MIP Replacement Process\n\nA MIP can define one or more replace` +
  `ment targets in its preamble. If the MIP is given the accepted status,` +
  ` the replacement target(s) MIPs then receive the Obsolete status and e` +
  `ffectively become inactive. The replaced MIP will in its MIP document ` +
  `contain the number of the MIP that replaced it, and other MIPs that de` +
  `pend on the replaced MIP, will instead interact with the new MIP.\n\nD` +
  `ue to the fact that the dependencies carry over, a MIP with defined re` +
  `placement targets must, in order to be valid, strictly adhere to depen` +
  `dency requirements and interface correctly with MIPs that depend on th` +
  `e replaced MIP, and thus after the replacement with the new MIP.  \n\n` +
  `---\n\n### MIP${mipNumber_1}c6: Supporting Materials\n\nMIPs can optionally refer t` +
  `o external materials. External materials must be added to the MIPs git` +
  `hub in the same folder as the MIP which references them.\n\nExternally` +
  ` referenced materials are not MIP content, and are not ratified when a` +
  ` MIP becomes Accepted unless it is explicitly stated otherwise in a MI` +
  `P Component specification.\n\n---\n\n### MIP${mipNumber_1}c7: MIP Templates\n\n**Ge` +
  `neral MIP Template**\n- The General MIP Template should be used for MI` +
  `Ps whenever a more specific ratified template is not more appropriate.` +
  ` \n- The General MIP Template is located at **[General-MIP-Template.md` +
  `](General-MIP-Template.md)**. This template is considered ratified onc` +
  `e this MIP moves to Accepted status.\n\n**Technical MIP Template**\n- ` +
  `The Technical MIP Template should be used for MIPs whenever a MIP prop` +
  `oses changes to the smart contract code within the Maker Protocol.\n- ` +
  `The Technical MIP Template is located at **[Technical-MIP-Template.md]` +
  `(Technical-MIP-Template.md)**. This template is considered ratified on` +
  `ce this MIP moves to Accepted status.\n---    \n\n### MIP${mipNumber_1}c8: MIP${mipNumber_1} Dom` +
  `ain Role Dependencies\n\n\nThe MIPs Framework depends on these types o` +
  `f Domain Roles:\n-   **MIP Editor(s):** Enforces the administrative an` +
  `d editorial aspects of the overall MIPs process and program. The expec` +
  `tation is that the program will start out with an interim editor from ` +
  `the Maker Foundation and that others will join later.\n-   **Specific ` +
  `authority of the MIP Editor(s) in MIP${mipNumber_1} processes:**\n\t-   The MIP Edi` +
  `tor(s) controls phase 2 of the MIP lifecycle and can assign MIP number` +
  `s\n\t-   The MIP Editor(s) is an admin on the MIPs Github repository\n` +
  `\t-   The MIP Editor(s) is a moderator on the MIPs Discourse forum\n\t` +
  `-   The MIP Editor(s) is responsible for updating the status of MIPs, ` +
  `as described in MIP${mipNumber_1}c4 “The MIP Lifecycle”.\n-   **Governance Facilita` +
  `tor:** Operates voting frontends, runs governance meetings and accepts` +
  ` MIPs that are ready to be included in the Governance Cycle and thus, ` +
  `voted on.\n-   **Specific authority of the Governance Facilitator in M` +
  `IP${mipNumber_1} processes:**\n\n\t-   Consensus from all governance facilitators c` +
  `ontrols phase 6 of the MIP lifecycle, which allows them to, with conse` +
  `nsus, add valid MIPs to the inclusion poll of the next governance cycl` +
  `e, moving them from phase 5 (formal submission) to phase 7 (governance` +
  ` cycle).\n\nPersonnel may be added to these roles using a MIP${mipNumber_1}c10 sub-` +
  `proposal.\nPersonnel may be removed from these roles using a MIP${mipNumber_1}c11 s` +
  `ub-proposal.\n\n---\n### MIP${mipNumber_1}c9: Core Personnel Role List \n\nThis lis` +
  `t can be amended through the core personnel onboarding (MIP${mipNumber_1}c12) and ` +
  `offboarding components (MIP${mipNumber_1}c13) of MIP${mipNumber_1}.\n\nEntries into this list sh` +
  `ould follow the following template:\n\n${"```"}\n- Person Name: The name of` +
  ` the person in the core role.\n\t- Sub-proposal Number (MIP${mipNumber_1}c12-SP): #` +
  `\n\t- Core Role: The core role in which the person operates.\n\t- Date` +
  ` Added: <date in (yyyy-mm-dd) format>\n${"```"}\n\n**Active Core Personnel ` +
  `List:**\n\n1. **Governance Facilitators:** \n\n- **Person Name:** Rich` +
  `ard Brown\n    - **Sub-proposal Number (MIP${mipNumber_1}c12-SP):** N/A (Governance` +
  ` Facilitator was ratified prior to the MIPs process. Reference: [Manda` +
  `te: Interim Governance Facilitators](https://forum.makerdao.com/t/mand` +
  `ate-interim-governance-facilitators/264))\n    - **Core Role:** Govern` +
  `ance Facilitator\n    - **Date Added:** 2019-09-09 ([Poll: Ratify the ` +
  `Interim Governance Facilitator Mandate](https://vote.makerdao.com/poll` +
  `ing-proposal/qmvh4z3l5ymqgtfs6tifq3jpjx5mxgdfnjy6alewnwwvba))\n\n- **P` +
  `erson Name:** LongForWisdom\n    - **Sub-proposal Number (MIP${mipNumber_1}c12-SP):` +
  `** 2\n    - **Core Role:** Governance Facilitator\n    - **Date Added:` +
  `** 2020-05-28 [Ratification Vote: Officially Ratify the MIP${mipNumber_1}c12-SP2 Su` +
  `bproposal for Onboarding a Second Governance Facilitator](https://mkrg` +
  `ov.science/executive/0x9713187b6d7c8d54ac041efdbac13d52c2120fb9)\n\n2.` +
  ` **MIP Editors:**\n\n-  **Person Name:** Charles St.Louis\n\t- **Sub-p` +
  `roposal Number (MIP${mipNumber_1}c12-SP):** 1\n\t- **Core Role:** MIP Editor\n\t- *` +
  `*Date Added:** 2020-05-02 ([Ratification Vote](https://vote.makerdao.c` +
  `om/executive-proposal/lower-usdc-sf-add-wbtc-ratify-the-initial-mips-a` +
  `nd-subproposals))\n\n---\n\n### MIP${mipNumber_1}c10: MIP Editor Role  \n\n\n**Resp` +
  `onsibilities**\n\nThe MIP Editor enforces the administrative and edito` +
  `rial aspects of the overall MIPs process and framework. This includes:` +
  `\n-   Maintain and manage mips.makerdao.com.\n-   Provide feedback and` +
  ` have discussions in the MIP section of forum.makerdao.com (ex: helpin` +
  `g vet proposal ideas).\n-   MIPs processing.\n-   Management and organ` +
  `ization of MIP and Subproposal Preambles. \n-   Onboard and vet new MI` +
  `P Editors.\n-   Enforcing the proper MIPs process with responsibilitie` +
  `s such as:\n    -   Confirm that the title accurately describes the co` +
  `ntent of the proposal.\n    -   Confirm there is a (real) dedicated au` +
  `thor, coordinator, funder and/or sponsor, etc. of the MIP.\n    -   As` +
  `sign proposed MIP's formal number labels.\n    -   Change MIP statuses` +
  `.\n    -   Correct MIP category placement.\n    -   Correspond with MI` +
  `P authors/coordinators.\n    -   Review the MIP for obvious defects in` +
  ` the language (format, completeness, spelling, grammar, sentence struc` +
  `ture) and that it follows the style guide (template). MIP Editors are ` +
  `allowed to correct problems themselves, but are not required to do so ` +
  `and can send comments to authors to improve it themselves.\n    -   Wo` +
  `rk and communicate with Governance Facilitators on coordinating govern` +
  `ance and executive votes in relation to MIPs and the governance cycle.` +
  `\n\n    \n\n**Selection Criteria**\n    \nThe following criteria shoul` +
  `d be used when selecting a MIP Editor:\n\n-   A complete understanding` +
  ` of the MIPs Framework\n-   Knowledge share will occur when onboarded ` +
  `but the candidate must be very familiar with the framework and how oth` +
  `er improvement proposal frameworks operate.\n-   Required to be a comm` +
  `unity member for some time. This can be shown through various proof of` +
  ` participation methods, such as:\n    -   Past forum posts\n    -   At` +
  `tendance of community and governance calls\n    -   Articles written a` +
  `bout Maker or Dai\n-   Familiarity with the technical inner workings o` +
  `f the Maker Protocol (bonus)\n-   Experience with Github\n    -   Merg` +
  `ing, editing, closing Pull Requests\n    -   Addressing issues\n    - ` +
  `  Adding tags / labels\n-   Experience with the Markdown language\n   ` +
  ` -   MIPs will be written in Markdown, so editors will need to be fami` +
  `liar with the language. \n\n**Addition**\n\nOnce a person has been onb` +
  `oarded to the MIP Editor role, they will be added to Github and subscr` +
  `ibed to watching the MIP repository. They will also become a moderator` +
  ` in the MIPs Rocket.Chat Channel and the MIPs Forum. Much of the corre` +
  `spondence regarding MIPs will be handled through GitHub as well in the` +
  ` MakerDAO forums.\n\n\n**Removal**\n\nA MIP Editor should be considere` +
  `d for removal if they are:\n    \n-   Not adequately performing their ` +
  `defined duties\n-   Absent from their duties for a prolonged period\n-` +
  `   Displaying biased or malicious behaviour\n-   Expressing unwillingn` +
  `ess to continue in their role.\n\nThe removal process begins once the ` +
  `community has agreed on the reasoning for removal. This process must b` +
  `e communicated publicly via the forums in order to provide complete tr` +
  `ansparency. **The MIP Editor will then be removed from the following c` +
  `hannels:**\n\n-   Github\n-   RocketChat\n-   Forums\n\n---\n\n### MIP` +
  `${mipNumber_1}c11: Governance Facilitator Role\n\n**Responsibilities**\n\nThe Gover` +
  `nance Facilitator's responsibilities are defined as the following:\n\n` +
  `Core Responsibilities\n- Responsible for ensuring the health and integ` +
  `rity of communication channels that are used for communication within ` +
  `MakerDAO. These tasks include moderation duties, establishing processe` +
  `s and social norms, and defending the channels from trolling and Sybil` +
  ` attacks.\n- Required to remain neutral and objective on issues outsid` +
  `e the governance domain and focus on policy, procedure and facilitatio` +
  `n.\n- Required to schedule, run and moderate weekly governance and ris` +
  `k meetings from a position of neutrality.\n- Required to manage and r` +
  `un governance processes as directed by relevant Accepted MIPs or MIP ` +
  `sets. \n- Required to create on-chain polls on the ‘official’ voting ` +
  `frontend as directed by governance processes defined in relevant Acce` +
  `pted MIPs or MIP sets.\n- Should aim to foster a culture of openness,` +
  ` receptiveness and reasoned discussion within the community.\n- Shoul` +
  `d work with the community to operate an emergency voting process to d` +
  `efend the system in the event of an emergency.\n- Should aim to onboa` +
  `rd and maintain at least three Governance Facilitators at all times w` +
  `hile prioritising candidates from unrepresented geographic regions.\n` +
  `\n\nEncouraging Participation\n- Should work to maintain and encourag` +
  `e healthy debate, in accordance with the guidelines outlined in the S` +
  `cientific Governance and Risk Framework and the Core Foundation Princ` +
  `ipals.\n- Should ensure that the upcoming governance schedule is well` +
  ` communicated to all stakeholders at least a week in advance.\n- Shou` +
  `ld aim to promote and increase engagement by stakeholders in the gove` +
  `rnance process. \n- Should ensure that new members of the community u` +
  `nderstand the general level of decorum and civility expected by the g` +
  `roup, that they have the resources they need to get onboarded quickly` +
  `.\n\nImproving Efficiency\n\n- Should ensure that once debate reaches` +
  ` its natural end that appropriate consensus gathering methods take pl` +
  `ace.\n- Should support and facilitate communications between the othe` +
  `r mandated actors in the Maker Protocol.\n- Should look for opportuni` +
  `ties to streamline the governance process without sacrificing its int` +
  `egrity. \n\nCohesion and Morale\n- Responsible for raising community ` +
  `governance issues to the Maker Foundation or the third-party ecosyste` +
  `m and ensuring appropriate follow up for the community.\n- Should hel` +
  `p to build and maintain morale and engagement among members of the go` +
  `vernance community.\n- Should encourage the community to come to cons` +
  `ensus over the least objectionable option(s) rather than treating dec` +
  `ision-making as a competition where a subset of the community must en` +
  `d up disappointed in the outcome. \n- Should work to bring the govern` +
  `ance community together on divisive topics and to prevent political p` +
  `olarisation and demagoguery. \n\n**Selection Criteria**\n    \nThe fo` +
  `llowing criteria should be used when evaluating an individual for the` +
  ` role of Governance Facilitator:\n\n- Should have a complete understa` +
  `nding of the MIPs Framework and content, especially in relation to co` +
  `re governance MIPs.\n- Required to be a community member for some tim` +
  `e. This can be shown through various proof of participation methods, ` +
  `such as:\n\t- Past forum posts\n\t- Attendance of community and gover` +
  `nance calls\n\t- Input into issues of governance in any communication` +
  `s venue.\n- Knowledge share will occur when onboarded but the candida` +
  `te must be familiar with the roles and responsibilities of Governance` +
  ` Facilitators.\n- Should have familiarity with the technical inner wo` +
  `rkings of the Maker Protocol (bonus)\n- Must have experience engaging` +
  ` with different stakeholders in the community in all the different ve` +
  `nues the community uses for communications including chat rooms, foru` +
  `ms and video conference calls.\n- Should be confident in expressing t` +
  `hemselves in each of the different venues the community uses for comm` +
  `unications including chat rooms, forums and video conference calls.\n` +
  `- Should have an interest in governance mechanisms used presently and` +
  ` historically across the world.\n\n**Removal**\n\nA Governance Facili` +
  `tator should be considered for removal if they are:\n-   Not adequate` +
  `ly performing their defined duties\n-   Absent from their duties for ` +
  `a prolonged period\n-   Displaying biased or malicious behaviour\n-  ` +
  ` Expressing unwillingness to continue in their role.\n    \nThe remov` +
  `al process begins once the community has agreed on the reasoning for ` +
  `removal. This process must be communicated publicly via the forums in` +
  ` order to provide complete transparency. **The Governance Facilitator` +
  ` will then be removed from the following channels:**\n-   Github\n-  ` +
  ` RocketChat\n-   Forums\n\n---\n\n### MIP${mipNumber_1}c12: Core Personnel Onboard` +
  `ing\n\nMIP${mipNumber_1}c12 is a Process MIP component that allows the onboarding ` +
  `of core personnel using a subproposal. MIP${mipNumber_1}c12 subproposals have the ` +
  `following parameters:\n-   **Feedback Period**: 3 months\n-   **Froze` +
  `n Period**: 1 month\n\nMIP${mipNumber_1}c12 subproposals must use the template loc` +
  `ated at  **[MIP${mipNumber_1}c12-Subproposal-Template.md](MIP${mipNumber_1}c12-Subproposal-Temp` +
  `late.md)**. This template is considered ratified once this MIP moves ` +
  `to Accepted status.\n\n---\n\n### MIP${mipNumber_1}c13: Core Personnel Offboarding` +
  `\n\nMIP${mipNumber_1}c13 is a Process MIP component that allows the removal of cor` +
  `e personnel using a subproposal. MIP${mipNumber_1}c13 subproposals have the follow` +
  `ing parameters:\n\n-   **Feedback Period**: 0 days\n-   **Frozen Peri` +
  `od**: 0 days\n\nMIP${mipNumber_1}c13 subproposals must use the template located at` +
  `  **[MIP${mipNumber_1}c13-Subproposal-Template.md](MIP${mipNumber_1}c13-Subproposal-Template.md` +
  `)**. This template is considered ratified once this MIP moves to Acce` +
  `pted status.\n\n---`;

// MIPsController (integration tests) and ParseMIPsService (unit tests) and MIPsService (unit tests)
export const mipData = {
  hash: faker.lorem.paragraph(),
  file:
    `# MIP${mipNumber_1}: ${titleMock}\n` +
    `\n` +
    `## Preamble\n` +
    `${"```"}\n` +
    `MIP#: ${mipNumber_1}\n` +
    `Title: ${titleMock}\n` +
    `Author(s): ${authorMock[0]}, ${authorMock[1]}\n` +
    `Forum URL: ${forumLinkMock}\n` +
    `Tags: ${tagsMock}` +
    `Contributors: ${contributorsMock}\n` +
    `Type: ${typesMock}\n` +
    `Ratification Poll URL: ${votingPortalLinkMock}\n` +
    `Status: ${statusMock} \n` +
    `Date Proposed: ${dateProposedMock}\n` +
    `Date Ratified: ${dateRatifiedMock}\n` +
    `Dependencies: ${dependenciesMock}\n` +
    `Replaces: ${replacesMock}\n` +
    `${"```"}\n` +
    `## References\n` +
    `**[General-MIP-Template.md](General-MIP-Template.md)**  \n` +
    `**[Technical-MIP-Template.md](Technical-MIP-Template.md)**  \n` +
    `**[MIP${mipNumber_1}c12-Subproposal-Template.md](MIP${mipNumber_1}c12-Subproposal-Template.md)**  \n` +
    `**[MIP${mipNumber_1}c13-Subproposal-Template.md](MIP${mipNumber_1}c13-Subproposal-Template.md)**  \n` +
    `\n` +
    `## Sentence Summary\n` +
    `\n` +
    `${sentenceSummary}\n` +
    `\n` +
    `## Paragraph Summary\n` +
    `\n` +
    `${paragraphSummaryMock}\n` +
    `\n` +
    `## Component Summary ${mipNumber_1}\n` +
    `\n` +
    `**MIP${mipNumber_1}c1: Definitions of the Maker Improvement Proposal Framework**  \n` +
    `Defines several concepts that are important for understanding the MIPs process.\n` +
    `\n` +
    `**MIP${mipNumber_1}c2: Core Principles**  \n` +
    `Discusses some core principles that all MIPs should aim to follow.\n` +
    `\n` +
    `**MIP${mipNumber_1}c3: The MIP Lifecycle**  \n` +
    `Lays out how a MIP is created and moves through the process to become Accepted or Rejected.\n` +
    `\n` +
    `**MIP${mipNumber_1}c4: MIP Components and MIP Component Types**  \n` +
    `Discusses the use of components to compartmentalize and organise MIPs\n` +
    `\n` +
    `**MIP${mipNumber_1}c5: MIP Replacement Process**  \n` +
    `Discusses how MIPs can be replaced and the steps to be taken to maintain dependencies.\n` +
    `\n` +
    `**MIP${mipNumber_1}c6: Supporting Materials**\n` +
    `A component that defines how to include external materials inside MIPs.\n` +
    `\n` +
    `**MIP${mipNumber_1}c7: MIP Templates**  \n` +
    `Defines the MIP templates for both General and Technical MIPs.\n` +
    `\n` +
    `**MIP${mipNumber_1}c8: MIP${mipNumber_1} Domain Role Dependencies**  \n` +
    `Defines the core roles that the MIPs process requires to operate successfully.\n` +
    `\n` +
    `**MIP${mipNumber_1}c9: Core Personnel Role List**  \n` +
    `List of of personnel currently occupying core roles.\n` +
    `\n` +
    `**MIP${mipNumber_1}c10: MIP Editor Role**  \n` +
    `A component that defines the responsibilities, criteria and grounds for removal of the MIP Editor role.\n` +
    `\n` +
    `**MIP${mipNumber_1}c11: Governance Facilitator Role**  \n` +
    `A component that defines the responsibilities, criteria and grounds for removal of the Governance Facilitator role.\n` +
    `\n` +
    `**MIP${mipNumber_1}c12: Core Personnel Onboarding**  \n` +
    `A process component that defines the process to add personnel to the MIP Editor or Governance Facilitator roles.\n` +
    `\n` +
    `**MIP${mipNumber_1}c13: Core Personnel Offboarding**  \n` +
    `A process component that defines the process to remove personnel from the MIP Editor or Governance Facilitator roles.\n` +
    `\n` +
    `\n` +
    `## Motivation\n` +
    `\n` +
    `MakerDAO is evolving into an organization that is trustless, fully decentralized, open-sourced, and self-sustainable. In order to further enable this gradual evolution while maintaining governance functionality both during this process and after the dissolution of the Maker Foundation, Maker will be governed using Maker Improvement Proposals (MIPs).\n` +
    `\n` +
    `The purpose of the MIPs Framework is to open up the ability to improve Maker Governance and the Maker Protocol to anyone in the community.\n` +
    `\n` +
    `By empowering the participation of the community and other stakeholders to have a standard approach to proposing improvements, specifications, or process and state changes, the goal is to enable organic growth that will in turn bring MakerDAO closer to self-sustainability.\n` +
    `\n` +
    `In order for MIPs to be functional they need to comply with a basic standard outlining their internal structure and external dependencies. This standard is MIPs described in MIP${mipNumber_1}, the Maker Improvement Proposal Framework.\n` +
    `\n` +
    `\n` +
    `## Specification / Proposal Details\n` +
    `\n` +
    `### MIP${mipNumber_1}c1: Definitions of the Maker Improvement Proposal Framework\n` +
    `\n` +
    `- **Maker Improvement Proposals (MIPs):** are the preferred mechanism for improving Maker Governance and the Maker Protocol. Through an open and documented process, the goal is to collect as much community feedback as possible and reach the broadest possible consensus on how the Maker Protocol should evolve. A proposal clearly defines how and why Maker Governance or the Maker Protocol should be changed and ensures that this improvement is introduced in a responsible way, respecting the highest quality, security and community standards.\n` +
    `-   **MIP${mipNumber_1}:** The genesis MIP defining the MIPs framework. This MIP defines all of the processes that are required for the implementation of future MIPs. \n` +
    `-   **MIP Sets:** A MIP set is a group of several MIPs that are interdependent, in which without the entire set of MIPs existing, one or more MIPs in the Set become inconsistent, invalid or nonsensical. The intention is for MIP sets to together describe a single complex behaviour in such a way that allows each individual MIP to be written following the principle of Specificity but work together as a cohesive modular whole.\n` +
    `-   **MIP Types:** MIPs are separated into a number of types, and each type has its own list of MIPs and processes.\n` +
    `-   **Process MIP:** Process MIPs are used to create and define a specific recurring process that the Maker Protocol or Governance will employ.\n` +
    `-   **Subproposals (SPs):** A subproposal is an instance of a sub-process that has been defined by a specific MIP. Subproposals are named in the following format: MIP${mipNumber_1}-SP1 (where MIP${mipNumber_1} is a Process MIP and MIP${mipNumber_1}-SP1 is a subproposal under that Process MIP)  \n` +
    `-   **Minimum Feedback Period:** The minimum amount of time within which the community is able to give feedback in response to a proposed MIP.  \n` +
    `-   **Minimum Frozen Period:** The minimum amount of time during which a MIP must remain unchanged (frozen) before it can be submitted for ratification/implementation.\n` +
    `-   **Governance Facilitator(s):** Governance Facilitators are tasked with ensuring the smooth operation of the governance process. This involves a wide range of activities, anything from general administration to signals gathering to governance scheduling.\n` +
    `-  **MIP Editor(s):** Enforce the administrative and editorial aspects of the overall MIPs process and program. The expectation is that the program will start out with an interim editor from the Maker Foundation and that others will join later.\n` +
    `-   **Domain Teams**: Domain Teams work for the DAO, are onboarded through governance and are paid by the Protocol. Domain teams perform defined duties for the DAO, such as overseeing critical processes and mitigating risk. These teams consist of but are not limited to Risk, Oracles, Smart Contracts or Legal. \n` +
    `    \n` +
    `\n` +
    `---\n` +
    `### MIP${mipNumber_1}c2: Core Principles\n` +
    `\n` +
    ` 1. **Specificity:** A MIP needs to define and address a specific behaviour or single responsibility. MIPs with many different behaviours or responsibilities will not be allowed and must be split up into multiple MIPs.\n` +
    `\t - This mitigates the risk of having “fine print” or potential attacks hidden in large, complex MIPs.\n` +
    ` 2. **Completeness:** A MIP or MIP Set is complete if it has all the necessary or appropriate parts that cover a whole behaviour and avoids being only a specific part of a greater whole.\n` +
    `\t - This is important for both understandability, readability and accessibility of MIPs.\n` +
    `3.  **Avoid overlap:** Multiple MIPs should not implement the same type of behaviour independently. For instance, there should not be two separate but interchangeable ways to do collateral onboarding.\n` +
    `\t- This way the primary and best-understood process for each particular behaviour will be fairly available to everyone, without risking having a knowledge gap that makes it possible for some actors with better access to information to use different and potentially better processes\n` +
    `4. **Clarity:** A MIP must not have equally valid conflicting interpretations. MIP Authors and MIP Editors must strive to reduce ambiguity. A MIP must be as clear and easy to understand as possible.\n` +
    `\t- Any ambiguous MIPs are likely to cause contention or confusion in the future. Making everything as clear as possible also aids readability and helps to mitigate the risk of hidden attacks.\n` +
    `5. **Brevity:** A MIP must be as short as possible, including only that which is essential given the other core principles.\n` +
    `\t- The shorter MIPs are the more likely participants in governance are to read them in full. This also serves to reduce the surface area for hidden attacks.\n` +
    `\t\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c3: The MIP Lifecycle\n` +
    `\n` +
    `**The MIP Lifecycle Flow and MIP Statuses**\n` +
    `\n` +
    `![mip_life_cycle](https://user-images.githubusercontent.com/32653033/79086728-19d93900-7d0b-11ea-8086-c255d919096c.png)\n` +
    `\n` +
    `\n` +
    `**MIP Status Criteria**  \n` +
    `\n` +
    `**1. Conception:** The lifecycle of a MIP begins when the MIP proposal is posted on the Maker forum. However, in order for a MIP to move to the next stage, it needs to satisfy the transition criteria (1) described below:\n` +
    `\n` +
    `-   Submitted to the MIPs Discourse Forum.\n` +
    `-   Submitted to the MIPs Github repository (with a Pull Request created by the MIP Author or MIP Editor).\n` +
    `-   The format must follow the appropriate MIP Template for its type.\n` +
    `-   MIPs must be original or replacement versions of older MIPs (No repeats allowed).\n` +
    `\n` +
    `**2. Approved by MIP Editor(s):** This phase of a MIP’s life cycle is when the MIP Editor(s) confirms that the proposed MIP follows the correct structure and editorial criteria defined in the MIP template. If the criteria is not met, the MIP Editor(s) will provide an explanation to the MIP Author as to why and allow them to make the appropriate changes before reconsideration. If the criteria have been met, the MIP Editor(s) performs the following actions:\n` +
    `    \n` +
    `-   The MIP is approved by a MIP Editor(s) and is assigned a formal MIP number.\n` +
    `-   The PR is merged in by a MIP Editor(s).\n` +
    `\n` +
    `**3. Request for Comments (RFC):** This phase is when a MIP goes through a formal review period, including feedback from the community, further drafting and additions. The timeline for the RFC phase is defined by its Feedback Period and Frozen Period. In order to move to the next phase, it needs to satisfy the transition criteria listed below:\n` +
    `     \n` +
    ` - MIP Author finalizes changes of the MIP, based on community feedback.\n` +
    ` - MIPs have a Feedback Period of 3 months. The RFC phase lasts at least 3 months before the MIP can move to the next phase. \n` +
    ` - MIPs have a Frozen Period of 1 month. MIPs must not have had any changes for the last 1 month before they move to the next phase.\n` +
    `\n` +
    `**4. Fulfilled Feedback Period Requirements:** This status is given once the MIP has fulfilled the defined Feedback Period and Frozen Period. After the MIP has waited out its Feedback Period and Frozen Period, it’s ready for Formal Submission. Note that the Feedback Period and Frozen Period can overlap.\n` +
    `\n` +
    `**5. Formal Submission (FS):** This phase is when MIP Authors submit their complete MIP(s) to the Governance cycle by posting it to the formal submission forum category within the formal submission window of a governance cycle.\n` +
    `    - A MIP can be re-submitted to the formal submission process a maximum of 2 additional times (3 total), without having to go through phase 1- 4 again, if it failed to pass due to legitimate external reasons (e.g. got bundled in a governance poll or executive vote with a controversial proposal - subject to the governance facilitators judgement).\n` +
    `  \n` +
    `**6. Approved by the Governance Facilitator(s):** This phase is when the MIP must be formally approved by the Governance Facilitators.   \n` +
    `\n` +
    `- Once approved by the Governance Facilitator, the MIP will be included in the inclusion poll of the Governance cycle.\n` +
    `- If the MIP is not approved by the Governance Facilitator, it may be reconsidered at a later date to enter the Governance cycle. \n` +
    `    \n` +
    `**7. Governance Cycle:** This phase is when MKR holders vote on whether to include the MIP in the governance poll, ultimately determining whether or not the MIP can formally enter the governance cycle.\n` +
    `- Once approved for the governance poll, MKR holders determine whether to accept or reject the package of proposals in the governance poll and finally to ratify the result in the executive vote.  \n` +
    `\n` +
    `**8. Executive Vote:** This phase is when the MIP becomes officially ratified or not. Determined by MKR holders, the executive vote ultimately accepts or rejects the MIP.  \n` +
    `\n` +
    `**9. Accepted/Rejected:** The Executive vote results in either acceptance or rejection of the MIP. If passed, the MIP is officially accepted and is given the accepted status. If the executive vote fails to pass before expiring, the MIP is rejected.\n` +
    `- As described in phase 5, a rejected MIP, can be resubmitted, and in some cases (if it was rejected for provable extraneous explanation) may be allowed to enter the next Governance cycle immediately.  \n` +
    `      \n` +
    `\n` +
    `**Other MIP Statuses:**  \n` +
    `     \n` +
    `\n` +
    `**Withdrawn:** when a MIP Author withdraws their MIP proposal, such as when:\n` +
    `\n` +
    ` - A MIP may be withdrawn at any point before it enters the Governance cycle. \n` +
    ` - Note that a withdrawn proposal can be taken over from the original Author with a simple transition facilitated by a MIP Editor(s) and the respective parties. If the original MIP Author ceases to be available, the MIP Editor(s) may proceed with the transfer of Authors.\n` +
    `\n` +
    `**Deferred:** when a proposal has been deemed as not ready or not a priority but can be re-proposed at a later date.\n` +
    `-   Request for Comments (RFC) - Forum poll/signal request rejects a MIP Proposal.\n` +
    `\n` +
    `**Obsolete:** when a proposal is no longer used or is out of date, such as:\n` +
    `    \n` +
    `-   A MIP is replaced with a new proposal.\n` +
    `-   A MIP has been deferred for over 6 months.\n` +
    `-   A MIP Author has abandoned the proposal and no person has communicated willingness to take over MIP Author responsibility.\n` +
    `-   A MIP has been replaced by a newer, more updated MIP Proposal.\n` +
    `-   A MIP no longer makes sense to keep in consideration.\n` +
    `    \n` +
    `  \n` +
    `**MIP Status Change Process:**\n` +
    `    \n` +
    `\n` +
    `A status change for a MIP is requested by the MIP Author and will be reviewed by the MIP Editor(s) to see if it meets the status criteria of the requested status change. If it does, the Editor(s) will change the status of the MIP and the Author may proceed with the next stage of the process. If it does not, the MIP Editor(s) will revert with highlighted issues, and the Author must fix the highlighted issues before requesting another status change.\n` +
    `    \n` +
    `---\n` +
    `### MIP${mipNumber_1}c4: MIP Components and MIP Component Types\n` +
    `\n` +
    `\n` +
    `**MIP Components**\n` +
    `\n` +
    `- When necessary, MIPs can have multiple components if it needs to contain multiple units of logic to satisfy completeness. A MIP can also have only a single component.\n` +
    `- MIP components are categorized by types, depending on what kind of logic they contain. MIP components are named by their parent MIP. The abbreviation convention MIPXcY is used to refer to these components (as seen in this document).\n` +
    `- A MIP component has one type or no types. \n` +
    `\n` +
    `\n` +
    `**Component Types**\n` +
    `    \n` +
    `-   **Process MIP Component**  \n` +
    `      \n` +
    `    **Summary:** The purpose of a Process MIP component is to shape a specific process flow for the Maker community to adopt and standardize with respect to how governance operates. This MIP component type helps streamline specific processes in a transparent, open and traceable manner. A Process MIP will provide a publicly documented scope of a proposed process framework as well as a detailed description of the subproposal structure.  \n` +
    `      \n` +
    `    **Special Template:** N/A  \n` +
    `      \n` +
    `    **Important Notes:**  \n` +
    `\n` +
    `\t-   A Process MIP component must define the Feedback Period and Frozen Period for its sub proposals.\n` +
    `\t-   Sub proposals of Process MIP components with additional MIP Component types inherit the same types.  \n` +
    `      \n` +
    `    \n` +
    `\n` +
    `-   **Subproposals**  \n` +
    `      \n` +
    `    **Summary:** A subproposal is an expedited process that is defined within a MIP to serve as a definition of how to run a given process within the MIPs framework. \n` +
    `\n` +
    `- Subproposals require a template, a feedback period and a frozen period and are submitted using that template. Subproposals go through the MIPs process in the same way that full MIPs do. The template, feedback period and frozen period for a set of subproposals are defined using a MIP component known as a Process component. Any MIP containing a Process Component gains the Process type.\n` +
    `- The subproposal naming convention is MIPXcY-SPZ where Y is the Process Component that contains the subproposal template and X is the MIP containing that component. This is important in order to delineate between different types of subproposal defined in the same MIP under different Process components.\n` +
    `   \n` +
    `**Special Template:** N/A  \n` +
    `  \n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c5: MIP Replacement Process\n` +
    `\n` +
    `A MIP can define one or more replacement targets in its preamble. If the MIP is given the accepted status, the replacement target(s) MIPs then receive the Obsolete status and effectively become inactive. The replaced MIP will in its MIP document contain the number of the MIP that replaced it, and other MIPs that depend on the replaced MIP, will instead interact with the new MIP.\n` +
    `\n` +
    `Due to the fact that the dependencies carry over, a MIP with defined replacement targets must, in order to be valid, strictly adhere to dependency requirements and interface correctly with MIPs that depend on the replaced MIP, and thus after the replacement with the new MIP.  \n` +
    `\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c6: Supporting Materials\n` +
    `\n` +
    `MIPs can optionally refer to external materials. External materials must be added to the MIPs github in the same folder as the MIP which references them.\n` +
    `\n` +
    `Externally referenced materials are not MIP content, and are not ratified when a MIP becomes Accepted unless it is explicitly stated otherwise in a MIP Component specification.\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c7: MIP Templates\n` +
    `\n` +
    `**General MIP Template**\n` +
    `- The General MIP Template should be used for MIPs whenever a more specific ratified template is not more appropriate. \n` +
    `- The General MIP Template is located at **[General-MIP-Template.md](General-MIP-Template.md)**. This template is considered ratified once this MIP moves to Accepted status.\n` +
    `\n` +
    `**Technical MIP Template**\n` +
    `- The Technical MIP Template should be used for MIPs whenever a MIP proposes changes to the smart contract code within the Maker Protocol.\n` +
    `- The Technical MIP Template is located at **[Technical-MIP-Template.md](Technical-MIP-Template.md)**. This template is considered ratified once this MIP moves to Accepted status.\n` +
    `---    \n` +
    `\n` +
    `### MIP${mipNumber_1}c8: MIP${mipNumber_1} Domain Role Dependencies\n` +
    `\n` +
    `\n` +
    `The MIPs Framework depends on these types of Domain Roles:\n` +
    `-   **MIP Editor(s):** Enforces the administrative and editorial aspects of the overall MIPs process and program. The expectation is that the program will start out with an interim editor from the Maker Foundation and that others will join later.\n` +
    `-   **Specific authority of the MIP Editor(s) in MIP${mipNumber_1} processes:**\n` +
    `\t-   The MIP Editor(s) controls phase 2 of the MIP lifecycle and can assign MIP numbers\n` +
    `\t-   The MIP Editor(s) is an admin on the MIPs Github repository\n` +
    `\t-   The MIP Editor(s) is a moderator on the MIPs Discourse forum\n` +
    `\t-   The MIP Editor(s) is responsible for updating the status of MIPs, as described in MIP${mipNumber_1}c4 “The MIP Lifecycle”.\n` +
    `-   **Governance Facilitator:** Operates voting frontends, runs governance meetings and accepts MIPs that are ready to be included in the Governance Cycle and thus, voted on.\n` +
    `-   **Specific authority of the Governance Facilitator in MIP${mipNumber_1} processes:**\n` +
    `\n` +
    `\t-   Consensus from all governance facilitators controls phase 6 of the MIP lifecycle, which allows them to, with consensus, add valid MIPs to the inclusion poll of the next governance cycle, moving them from phase 5 (formal submission) to phase 7 (governance cycle).\n` +
    `\n` +
    `Personnel may be added to these roles using a MIP${mipNumber_1}c10 sub-proposal.\n` +
    `Personnel may be removed from these roles using a MIP${mipNumber_1}c11 sub-proposal.\n` +
    `\n` +
    `---\n` +
    `### MIP${mipNumber_1}c9: Core Personnel Role List \n` +
    `\n` +
    `This list can be amended through the core personnel onboarding (MIP${mipNumber_1}c12) and offboarding components (MIP${mipNumber_1}c13) of MIP${mipNumber_1}.\n` +
    `\n` +
    `Entries into this list should follow the following template:\n` +
    `\n` +
    `${"```"}\n` +
    `- Person Name: The name of the person in the core role.\n` +
    `\t- Sub-proposal Number (MIP${mipNumber_1}c12-SP): #\n` +
    `\t- Core Role: The core role in which the person operates.\n` +
    `\t- Date Added: <date in (yyyy-mm-dd) format>\n` +
    `${"```"}\n` +
    `\n` +
    `**Active Core Personnel List:**\n` +
    `\n` +
    `1. **Governance Facilitators:** \n` +
    `\n` +
    `- **Person Name:** Richard Brown\n` +
    `    - **Sub-proposal Number (MIP${mipNumber_1}c12-SP):** N/A (Governance Facilitator was ratified prior to the MIPs process. Reference: [Mandate: Interim Governance Facilitators](https://forum.makerdao.com/t/mandate-interim-governance-facilitators/264))\n` +
    `    - **Core Role:** Governance Facilitator\n` +
    `    - **Date Added:** 2019-09-09 ([Poll: Ratify the Interim Governance Facilitator Mandate](https://vote.makerdao.com/polling-proposal/qmvh4z3l5ymqgtfs6tifq3jpjx5mxgdfnjy6alewnwwvba))\n` +
    `\n` +
    `- **Person Name:** LongForWisdom\n` +
    `    - **Sub-proposal Number (MIP${mipNumber_1}c12-SP):** 2\n` +
    `    - **Core Role:** Governance Facilitator\n` +
    `    - **Date Added:** 2020-05-28 [Ratification Vote: Officially Ratify the MIP${mipNumber_1}c12-SP2 Subproposal for Onboarding a Second Governance Facilitator](https://mkrgov.science/executive/0x9713187b6d7c8d54ac041efdbac13d52c2120fb9)\n` +
    `\n` +
    `2. **MIP Editors:**\n` +
    `\n` +
    `-  **Person Name:** Charles St.Louis\n` +
    `\t- **Sub-proposal Number (MIP${mipNumber_1}c12-SP):** 1\n` +
    `\t- **Core Role:** MIP Editor\n` +
    `\t- **Date Added:** 2020-05-02 ([Ratification Vote](https://vote.makerdao.com/executive-proposal/lower-usdc-sf-add-wbtc-ratify-the-initial-mips-and-subproposals))\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c10: MIP Editor Role  \n` +
    `\n` +
    `\n` +
    `**Responsibilities**\n` +
    `\n` +
    `The MIP Editor enforces the administrative and editorial aspects of the overall MIPs process and framework. This includes:\n` +
    `-   Maintain and manage mips.makerdao.com.\n` +
    `-   Provide feedback and have discussions in the MIP section of forum.makerdao.com (ex: helping vet proposal ideas).\n` +
    `-   MIPs processing.\n` +
    `-   Management and organization of MIP and Subproposal Preambles. \n` +
    `-   Onboard and vet new MIP Editors.\n` +
    `-   Enforcing the proper MIPs process with responsibilities such as:\n` +
    `    -   Confirm that the title accurately describes the content of the proposal.\n` +
    `    -   Confirm there is a (real) dedicated author, coordinator, funder and/or sponsor, etc. of the MIP.\n` +
    `    -   Assign proposed MIP's formal number labels.\n` +
    `    -   Change MIP statuses.\n` +
    `    -   Correct MIP category placement.\n` +
    `    -   Correspond with MIP authors/coordinators.\n` +
    `    -   Review the MIP for obvious defects in the language (format, completeness, spelling, grammar, sentence structure) and that it follows the style guide (template). MIP Editors are allowed to correct problems themselves, but are not required to do so and can send comments to authors to improve it themselves.\n` +
    `    -   Work and communicate with Governance Facilitators on coordinating governance and executive votes in relation to MIPs and the governance cycle.\n` +
    `\n` +
    `    \n` +
    `\n` +
    `**Selection Criteria**\n` +
    `    \n` +
    `The following criteria should be used when selecting a MIP Editor:\n` +
    `\n` +
    `-   A complete understanding of the MIPs Framework\n` +
    `-   Knowledge share will occur when onboarded but the candidate must be very familiar with the framework and how other improvement proposal frameworks operate.\n` +
    `-   Required to be a community member for some time. This can be shown through various proof of participation methods, such as:\n` +
    `    -   Past forum posts\n` +
    `    -   Attendance of community and governance calls\n` +
    `    -   Articles written about Maker or Dai\n` +
    `-   Familiarity with the technical inner workings of the Maker Protocol (bonus)\n` +
    `-   Experience with Github\n` +
    `    -   Merging, editing, closing Pull Requests\n` +
    `    -   Addressing issues\n` +
    `    -   Adding tags / labels\n` +
    `-   Experience with the Markdown language\n` +
    `    -   MIPs will be written in Markdown, so editors will need to be familiar with the language. \n` +
    `\n` +
    `**Addition**\n` +
    `\n` +
    `Once a person has been onboarded to the MIP Editor role, they will be added to Github and subscribed to watching the MIP repository. They will also become a moderator in the MIPs Rocket.Chat Channel and the MIPs Forum. Much of the correspondence regarding MIPs will be handled through GitHub as well in the MakerDAO forums.\n` +
    `\n` +
    `\n` +
    `**Removal**\n` +
    `\n` +
    `A MIP Editor should be considered for removal if they are:\n` +
    `    \n` +
    `-   Not adequately performing their defined duties\n` +
    `-   Absent from their duties for a prolonged period\n` +
    `-   Displaying biased or malicious behaviour\n` +
    `-   Expressing unwillingness to continue in their role.\n` +
    `\n` +
    `The removal process begins once the community has agreed on the reasoning for removal. This process must be communicated publicly via the forums in order to provide complete transparency. **The MIP Editor will then be removed from the following channels:**\n` +
    `\n` +
    `-   Github\n` +
    `-   RocketChat\n` +
    `-   Forums\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c11: Governance Facilitator Role\n` +
    `\n` +
    `**Responsibilities**\n` +
    `\n` +
    `The Governance Facilitator's responsibilities are defined as the following:\n` +
    `\n` +
    `Core Responsibilities\n` +
    `- Responsible for ensuring the health and integrity of communication channels that are used for communication within MakerDAO. These tasks include moderation duties, establishing processes and social norms, and defending the channels from trolling and Sybil attacks.\n` +
    `- Required to remain neutral and objective on issues outside the governance domain and focus on policy, procedure and facilitation.\n` +
    `- Required to schedule, run and moderate weekly governance and risk meetings from a position of neutrality.\n` +
    `- Required to manage and run governance processes as directed by relevant Accepted MIPs or MIP sets. \n` +
    `- Required to create on-chain polls on the ‘official’ voting frontend as directed by governance processes defined in relevant Accepted MIPs or MIP sets.\n` +
    `- Should aim to foster a culture of openness, receptiveness and reasoned discussion within the community.\n` +
    `- Should work with the community to operate an emergency voting process to defend the system in the event of an emergency.\n` +
    `- Should aim to onboard and maintain at least three Governance Facilitators at all times while prioritising candidates from unrepresented geographic regions.\n` +
    `\n` +
    `\n` +
    `Encouraging Participation\n` +
    `- Should work to maintain and encourage healthy debate, in accordance with the guidelines outlined in the Scientific Governance and Risk Framework and the Core Foundation Principals.\n` +
    `- Should ensure that the upcoming governance schedule is well communicated to all stakeholders at least a week in advance.\n` +
    `- Should aim to promote and increase engagement by stakeholders in the governance process. \n` +
    `- Should ensure that new members of the community understand the general level of decorum and civility expected by the group, that they have the resources they need to get onboarded quickly.\n` +
    `\n` +
    `Improving Efficiency\n` +
    `\n` +
    `- Should ensure that once debate reaches its natural end that appropriate consensus gathering methods take place.\n` +
    `- Should support and facilitate communications between the other mandated actors in the Maker Protocol.\n` +
    `- Should look for opportunities to streamline the governance process without sacrificing its integrity. \n` +
    `\n` +
    `Cohesion and Morale\n` +
    `- Responsible for raising community governance issues to the Maker Foundation or the third-party ecosystem and ensuring appropriate follow up for the community.\n` +
    `- Should help to build and maintain morale and engagement among members of the governance community.\n` +
    `- Should encourage the community to come to consensus over the least objectionable option(s) rather than treating decision-making as a competition where a subset of the community must end up disappointed in the outcome. \n` +
    `- Should work to bring the governance community together on divisive topics and to prevent political polarisation and demagoguery. \n` +
    `\n` +
    `**Selection Criteria**\n` +
    `    \n` +
    `The following criteria should be used when evaluating an individual for the role of Governance Facilitator:\n` +
    `\n` +
    `- Should have a complete understanding of the MIPs Framework and content, especially in relation to core governance MIPs.\n` +
    `- Required to be a community member for some time. This can be shown through various proof of participation methods, such as:\n` +
    `\t- Past forum posts\n` +
    `\t- Attendance of community and governance calls\n` +
    `\t- Input into issues of governance in any communications venue.\n` +
    `- Knowledge share will occur when onboarded but the candidate must be familiar with the roles and responsibilities of Governance Facilitators.\n` +
    `- Should have familiarity with the technical inner workings of the Maker Protocol (bonus)\n` +
    `- Must have experience engaging with different stakeholders in the community in all the different venues the community uses for communications including chat rooms, forums and video conference calls.\n` +
    `- Should be confident in expressing themselves in each of the different venues the community uses for communications including chat rooms, forums and video conference calls.\n` +
    `- Should have an interest in governance mechanisms used presently and historically across the world.\n` +
    `\n` +
    `**Removal**\n` +
    `\n` +
    `A Governance Facilitator should be considered for removal if they are:\n` +
    `-   Not adequately performing their defined duties\n` +
    `-   Absent from their duties for a prolonged period\n` +
    `-   Displaying biased or malicious behaviour\n` +
    `-   Expressing unwillingness to continue in their role.\n` +
    `    \n` +
    `The removal process begins once the community has agreed on the reasoning for removal. This process must be communicated publicly via the forums in order to provide complete transparency. **The Governance Facilitator will then be removed from the following channels:**\n` +
    `-   Github\n` +
    `-   RocketChat\n` +
    `-   Forums\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c12: Core Personnel Onboarding\n` +
    `\n` +
    `MIP${mipNumber_1}c12 is a Process MIP component that allows the onboarding of core personnel using a subproposal. MIP${mipNumber_1}c12 subproposals have the following parameters:\n` +
    `-   **Feedback Period**: 3 months\n` +
    `-   **Frozen Period**: 1 month\n` +
    `\n` +
    `MIP${mipNumber_1}c12 subproposals must use the template located at  **[MIP${mipNumber_1}c12-Subproposal-Template.md](MIP${mipNumber_1}c12-Subproposal-Template.md)**. This template is considered ratified once this MIP moves to Accepted status.\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### MIP${mipNumber_1}c13: Core Personnel Offboarding\n` +
    `\n` +
    `MIP${mipNumber_1}c13 is a Process MIP component that allows the removal of core personnel using a subproposal. MIP${mipNumber_1}c13 subproposals have the following parameters:\n` +
    `\n` +
    `-   **Feedback Period**: 0 days\n` +
    `-   **Frozen Period**: 0 days\n` +
    `\n` +
    `MIP${mipNumber_1}c13 subproposals must use the template located at  **[MIP${mipNumber_1}c13-Subproposal-Template.md](MIP${mipNumber_1}c13-Subproposal-Template.md)**. This template is considered ratified once this MIP moves to Accepted status.\n` +
    `\n` +
    `---`,
  filename,
  sentenceSummary,
  paragraphSummary: paragraphSummaryMock,
  author: authorMock,
  contributors: contributorsMock,
  dateProposed: dateProposedMock,
  dateRatified: dateRatifiedMock,
  dependencies: dependenciesMock,
  mip,
  replaces: replacesMock,
  status: statusMock,
  title: titleMock,
  types: typesMock,
  votingPortalLink: votingPortalLinkMock,
  forumLink: forumLinkMock,
  tags: [tagsMock],
};

// ParseMIPsService (unit tests)
export const preambleMock: IPreamble = {
  ...mipData,
  mipName: faker.random.word(),
};
export const errorUpdateMock: string = faker.random.words();

// MIPsController (integration tests) and 
export const mipData_2: MIP = {
  ...mipData,
  mip: 1,
  filename: `MIP${mipNumber_2}/mip${mipNumber_2}.md`,
  sentenceSummary: `MIP${mipNumber_2} ${faker.lorem.words(5)}`,
  title: `${faker.lorem.words(5)} v2`,
  references: [],
  proposal: `MIP${mipNumber_2}`,
  subproposal: -1,
  tags: [faker.random.word()],
  status: faker.random.arrayElement(['Accepted', 'Rejected', 'RFC']),
  extra: [],
  language: Language.English,
  mipFather: false,
  components: [],
  sectionsRaw: [`MIP${mipNumber_2}`],
}
export const tagResultMock = {
  tag: mipData.tags[0],
};
export const statusResultMock = {
  status: mipData_2.status,
};
export const smartSearchFieldMock: string = faker.random.word();

// MarkedService unit tests
export const markedMock: string = faker.random.word();
export const markedLexerMock: any[] = [{
  type: faker.random.word(),
  value: faker.random.word(),
}];
export const requestGraphql: string = faker.random.word();
export const pullRequestsMock: RequestDocument = {
  definitions: [],
  kind: faker.random.word(),
};

// GithubService unit tests
export const openIssueTitleMock: string = faker.random.word();
export const openIssueBodyMock: string = faker.random.word();

// MIPsService unit test
export const mipFilesMapMock = new Map();
mipFilesMapMock.set(mipData.filename, mipData)