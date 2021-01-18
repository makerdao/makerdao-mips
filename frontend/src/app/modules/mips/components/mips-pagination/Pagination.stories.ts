import { Story, Meta } from '@storybook/angular/types-6-0';
import { MipsPaginationComponent } from './mips-pagination.component';

export default {
  title: 'DEVELOP/Components/Pagination',
  component: MipsPaginationComponent,
} as Meta;

const Template: Story<MipsPaginationComponent> = (args: MipsPaginationComponent) => ({
  component: MipsPaginationComponent,
  props: args,
});

export const Default = Template.bind({});

Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/EuDxD9e2oviaYGAQwryP9q/Web?node-id=41%3A343'
 }
};





