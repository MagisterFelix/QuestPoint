import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { styles, theme } from '@/common/styles';
import { DialogWindowProps } from '@/types/props';

const DialogWindow = ({
  title,
  type,
  message,
  button,
  onDismiss,
  onAgreePress
}: DialogWindowProps) => {
  return (
    <Portal>
      <Dialog visible={message !== ''} onDismiss={onDismiss}>
        <Dialog.Icon
          icon={
            type === 'success'
              ? 'alert-circle'
              : type === 'error'
                ? 'alert-octagon'
                : 'alert-box'
          }
          color={
            type === 'success'
              ? theme.colors.success
              : type === 'error'
                ? theme.colors.error
                : theme.colors.info
          }
          size={48}
        />
        <Dialog.Title style={styles.textCenter}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textCenter}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onAgreePress}>{button}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWindow;
