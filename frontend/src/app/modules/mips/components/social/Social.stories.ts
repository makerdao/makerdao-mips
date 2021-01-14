import { Story, Meta } from '@storybook/angular/types-6-0';
import { SocialComponent } from './social.component';

export default {
  title: 'DEVELOP/Components/Social',
  component: SocialComponent,
} as Meta;

const Template: Story<SocialComponent> = (args: SocialComponent) => ({
  component: SocialComponent,
  props: args,
});

export const Accepted = Template.bind({});


