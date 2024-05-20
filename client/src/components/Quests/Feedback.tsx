import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput
} from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { styles, theme } from '@/common/styles';
import DialogWindow from '@/components/DialogWindow';
import Rating from '@/components/Quests/Rating';
import { FeedbackProps } from '@/types/Quests/props';
import { FeedbackRequestData } from '@/types/Quests/request';

const Feedback = ({
  show,
  user,
  onCancelPress,
  onAgreePress
}: FeedbackProps) => {
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

  const [message, setMessage] = useState<string>('');
  const hideMessage = () => setMessage('');
  const { control, handleSubmit } = useForm();
  const handleOnSubmit = async (data: FeedbackRequestData) => {
    Keyboard.dismiss();
    await request({
      url: `${ENDPOINTS.feedback}${user}/`,
      method: 'POST',
      data
    });
    setMessage('Feedback has been sent successfully!');
    onAgreePress();
  };

  return (
    <Portal>
      <Dialog visible={show} onDismiss={onCancelPress}>
        <Dialog.Icon icon="account-edit" size={48} />
        <Dialog.Title style={styles.textCenter}>
          Leave a review for user
        </Dialog.Title>
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
              <View>
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
              </View>
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
          <Button textColor={theme.colors.error} onPress={onCancelPress}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onPress={handleSubmit((data: object) =>
              handleOnSubmit(data as FeedbackRequestData)
            )}
          >
            Send
          </Button>
        </Dialog.Actions>
      </Dialog>
      <DialogWindow
        title="Congratulations!"
        type="success"
        message={message}
        button="OK"
        onDismiss={hideMessage}
        onAgreePress={hideMessage}
      />
    </Portal>
  );
};

export default Feedback;
