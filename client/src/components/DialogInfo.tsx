import { Button, Dialog, Text } from 'react-native-paper';

import { styles, theme } from '@/common/styles';
import { DialogInfoProps } from '@/types/props';

const DialogInfo = ({
  title,
  info,
  button,
  onDismiss,
  onAgreePress
}: DialogInfoProps) => {
  return (
    <Dialog visible={info !== ''} onDismiss={onDismiss}>
      <Dialog.Icon icon="alert-box" color={theme.colors.info} size={48} />
      <Dialog.Title style={styles.dialogContent}>{title}</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.dialogContent}>{info}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onAgreePress}>{button}</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogInfo;
