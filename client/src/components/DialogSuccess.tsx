import { Button, Dialog, Text } from 'react-native-paper';

import { styles, theme } from '@/common/styles';
import { DialogSuccessProps } from '@/types/props';

const DialogSuccess = ({
  title,
  message,
  button,
  onDismiss,
  onAgreePress
}: DialogSuccessProps) => {
  return (
    <Dialog visible={message !== ''} onDismiss={onDismiss}>
      <Dialog.Icon icon="alert-circle" color={theme.colors.success} size={48} />
      <Dialog.Title style={styles.textCenter}>{title}</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.textCenter}>{message}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onAgreePress}>{button}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogSuccess;
