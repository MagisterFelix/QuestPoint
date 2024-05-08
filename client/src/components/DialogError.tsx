import { Button, Dialog, Text } from 'react-native-paper';

import { styles, theme } from '@/common/styles';
import { DialogErrorProps } from '@/types/props';

const DialogError = ({
  title,
  error,
  button,
  onDismiss,
  onAgreePress
}: DialogErrorProps) => {
  return (
    <Dialog visible={error !== ''} onDismiss={onDismiss}>
      <Dialog.Icon icon="alert-octagon" color={theme.colors.error} size={48} />
      <Dialog.Title style={styles.dialogContent}>{title}</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.dialogContent}>{error}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onAgreePress}>{button}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogError;
