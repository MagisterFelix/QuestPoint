import { Controller, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import { Button, Dialog, HelperText, TextInput } from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import Rating from '@/components/Rating';
import { DialogFeedbackProps } from '@/types/props';
import { CreateFeedbackRequestData } from '@/types/request';

const DialogFeedback = ({
  title,
  show,
  user,
  button,
  onDismiss,
  onAgreePress
}: DialogFeedbackProps) => {
  if (show) {
    Keyboard.removeAllListeners('keyboardDidShow');
    Keyboard.removeAllListeners('keyboardDidHide');
  }

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const validation = {
    rating: {
      min: 'Rating is required.'
    }
  };

  const { control, handleSubmit } = useForm();
  const handleOnSubmit = async (data: CreateFeedbackRequestData) => {
    Keyboard.dismiss();
    await request({
      url: `${ENDPOINTS.feedback}${user}/`,
      method: 'POST',
      data
    });
    onAgreePress();
  };

  return (
    <Dialog visible={show} onDismiss={onDismiss}>
      <Dialog.Icon icon="account-edit" color={theme.colors.info} size={48} />
      <Dialog.Title style={styles.textCenter}>{title}</Dialog.Title>
      <Dialog.Content>
        <Controller
          name="rating"
          control={control}
          defaultValue={0}
          rules={{
            min: 1
          }}
          render={({
            field: { onChange, value },
            fieldState: { error: fieldError }
          }) => (
            <>
              <Rating
                rating={value}
                onStarPress={(rating: number) => onChange(rating)}
              />
              {fieldError !== undefined && (
                <HelperText type="error" style={styles.textCenter}>
                  {fieldError
                    ? fieldError.message ||
                      validation.rating[
                        fieldError.type as keyof typeof validation.rating
                      ]
                    : ''}
                </HelperText>
              )}
            </>
          )}
        />
        <Controller
          name="text"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Text"
              mode="outlined"
              multiline
              numberOfLines={5}
              value={value}
              onChangeText={onChange}
              right={<TextInput.Icon icon="file-document-edit" />}
            />
          )}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button textColor={theme.colors.error} onPress={onDismiss}>
          Cancel
        </Button>
        <Button
          loading={loading}
          disabled={loading}
          onPress={handleSubmit((data: object) =>
            handleOnSubmit(data as CreateFeedbackRequestData)
          )}
        >
          {button}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DialogFeedback;
