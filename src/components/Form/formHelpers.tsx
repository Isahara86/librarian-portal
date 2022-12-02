import {
  Button,
  FormProps,
  notification,
  Space,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { uniqBy } from 'lodash';
import { changedFieldsNamesVar } from 'vars';

export const notificationKey = 'fieldsChangeNotification';

// eslint-disable-next-line import/prefer-default-export
export const onFieldsWithNotificationChange = (form: FormInstance) => {
  const onFieldsChange: FormProps['onFieldsChange'] = (_, allFields) => {
    const fields = uniqBy(allFields, item => item.name.toString());

    const { length } = fields.filter(({ touched }) => touched);
    const names = fields.map(({ name }) => name);

    changedFieldsNamesVar(names);

    if (length) {
      notification.open({
        key: notificationKey,
        message: `You’ve changed ${length} ${length > 1 ? 'fields' : 'field'}`,
        style: { width: 270 },
        btn: (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={ () => {
                form.submit();

                notification.destroy(notificationKey);
              } }
            >
              Update
            </Button>
          </Space>
        ),
        placement: 'bottomRight',
        duration: 0,
      });
    }
  };

  return onFieldsChange;
};
