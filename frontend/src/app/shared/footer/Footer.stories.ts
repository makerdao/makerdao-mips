import { Story, Meta } from '@storybook/angular/types-6-0';
import { FooterComponent } from './footer.component';

export default {
  title: 'DEVELOP/Layout/Footer',
  component: FooterComponent,
} as Meta;

const Template: Story<FooterComponent> = (args: FooterComponent) => ({
  component: FooterComponent,
  props: args,
});

export const Default = Template.bind({});





