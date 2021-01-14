import { Story, Meta } from '@storybook/angular/types-6-0';
import { ProposalComponentsComponent } from './proposal-components.component';

export default {
  title: 'DEVELOP/Components/Proposal Components',
  component: ProposalComponentsComponent,
} as Meta;

const Template: Story<ProposalComponentsComponent> = (args: ProposalComponentsComponent) => ({
  component: ProposalComponentsComponent,
  props: args,
});

export const Default = Template.bind({});







