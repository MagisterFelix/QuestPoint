import { AxiosError } from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { PaperSelect } from 'react-native-paper-select';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { handleErrors } from '@/api/errors';
import { styles, theme } from '@/common/styles';
import DialogWindow from '@/components/DialogWindow';
import Loading from '@/components/Loading';
import { useAuth } from '@/providers/AuthProvider';
import { useQuestData } from '@/providers/QuestDataProvider';
import {
  CreateQuestRequestData,
  UpdateQuestRequestData
} from '@/types/Quests/request';
import {
  CategoryResponseData,
  QuestResponseData
} from '@/types/Quests/response';
import { ErrorData } from '@/types/errors';
import { ScreenProps } from '@/types/props';

const QuestFormScreen = ({ route, navigation }: ScreenProps) => {
  const { updateQuests } = useQuestData();

  const quest: QuestResponseData = route.params?.quest;

  const { user, getProfile } = useAuth();

  const [{ loading: loadingCategories, data: categories }] = useAxios<
    CategoryResponseData[]
  >({
    url: ENDPOINTS.categories,
    method: 'GET'
  });

  const [{ loading }, request] = useAxios(
    {},
    {
      manual: true
    }
  );

  const [choose, setChoose] = useState<'update' | 'remove' | null>(null);

  const validation = {
    title: {
      required: 'This field may not be blank.',
      maxLength: 'No more than 64 characters.'
    },
    description: {
      required: 'This field may not be blank.',
      maxLength: 'No more than 256 characters.'
    },
    reward: {
      required: 'This field may not be blank.',
      min: 'At least 5 coins.',
      max: 'No more than current balance for payout.',
      pattern: 'Provide a valid reward.'
    },
    category: {
      required: 'This field may not be blank.'
    }
  };

  const [message, setMessage] = useState<string>('');
  const hideMessage = () => setMessage('');
  const [info, setInfo] = useState<string>('');
  const hideInfo = () => setInfo('');
  const [error, setError] = useState<string>('');
  const hideError = () => setError('');
  const {
    control,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    reset
  } = useForm();
  const handleOnSubmit = async (data: CreateQuestRequestData) => {
    Keyboard.dismiss();
    const errorHandler = {
      validation,
      setError,
      setFieldError
    };
    try {
      await request({
        url: ENDPOINTS.quests,
        method: 'POST',
        data
      });
      reset({ title: '', description: '', reward: '', category: '' });
      setMessage('Quest has been created successfully!');
      await getProfile!();
    } catch (err) {
      const error = (err as AxiosError).response?.data as ErrorData;
      handleErrors(error.details, errorHandler);
    }
  };
  const handleOnUpdate = async (data: UpdateQuestRequestData) => {
    setChoose('update');
    Keyboard.dismiss();
    const errorHandler = {
      validation,
      setError,
      setFieldError
    };
    const filtered: UpdateQuestRequestData = {};
    if (data.title && quest?.title !== data.title) {
      filtered['title'] = data.title;
    }
    if (data.description && quest?.description !== data.description) {
      filtered['description'] = data.description;
    }
    if (data.reward && Number(quest?.reward) !== Number(data.reward)) {
      filtered['reward'] = Number(data.reward);
    }
    if (data.category && quest?.category.id !== data.category) {
      filtered['category'] = data.category;
    }
    if (Object.entries(filtered).length === 0) {
      setInfo('Nothing to update!');
    } else {
      try {
        await request({
          url: `${ENDPOINTS.quest}${quest?.id}/`,
          method: 'PATCH',
          data: filtered
        });
        await updateQuests!();
        setMessage('Quest has been updated successfully!');
        await getProfile!();
      } catch (err) {
        const error = (err as AxiosError).response?.data as ErrorData;
        handleErrors(error.details, errorHandler);
      }
    }
    setChoose(null);
  };
  const handleOnRemove = async () => {
    setChoose('remove');
    await request({
      url: `${ENDPOINTS.quest}${quest?.id}/`,
      method: 'DELETE'
    });
    await updateQuests!();
    setMessage('Quest has been deleted successfully!');
    await getProfile!();
    setChoose(null);
  };

  if (loadingCategories && !categories) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, styles.justifyContentCenter]}>
      <Controller
        name="title"
        control={control}
        defaultValue={quest ? quest.title : ''}
        rules={{
          required: true
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Title *"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="format-title" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.title[
                      fieldError.type as keyof typeof validation.title
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        name="description"
        control={control}
        defaultValue={quest ? quest.description : ''}
        rules={{
          required: true
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Description *"
              mode="outlined"
              multiline
              numberOfLines={3}
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="text-box" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.description[
                      fieldError.type as keyof typeof validation.description
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      <Controller
        name="reward"
        control={control}
        defaultValue={quest ? quest.reward.toString() : ''}
        rules={{
          required: true,
          min: 5,
          max: user?.balance! / 1.2,
          pattern: /^\d+$/
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <TextInput
              label="Reward *"
              mode="outlined"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              onFocus={() => clearErrors()}
              error={fieldError !== undefined}
              style={styles.formField}
              right={<TextInput.Icon icon="currency-usd" />}
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.reward[
                      fieldError.type as keyof typeof validation.reward
                    ]
                  : ''}
              </HelperText>
            )}
            {value &&
              RegExp(/^\d+$/).test(value) &&
              fieldError === undefined && (
                <HelperText type="info" style={styles.formHelperText}>
                  {quest ? (
                    value < quest.reward ? (
                      <Text>
                        You will get {(quest.reward - value) * 1.2} coins
                      </Text>
                    ) : (
                      <Text>
                        You will pay {(value - quest.reward) * 1.2} coins
                      </Text>
                    )
                  ) : (
                    <Text>You will pay {value * 1.2} coins</Text>
                  )}
                </HelperText>
              )}
          </View>
        )}
      />
      <Controller
        name="category"
        control={control}
        defaultValue={
          quest
            ? {
                selectedList: [
                  { _id: quest.category.id, value: quest.category.title }
                ],
                text: quest.category.title
              }
            : ''
        }
        rules={{
          required: true
        }}
        render={({
          field: { onChange, value },
          fieldState: { error: fieldError }
        }) => (
          <View>
            <PaperSelect
              label="Category *"
              textInputMode="outlined"
              multiEnable={false}
              hideSearchBox
              value={value.text ? value.text : value}
              onSelection={(value: any) => onChange(value.text ? value : '')}
              arrayList={categories!.map((category: any) => ({
                _id: category.id,
                value: category.title
              }))}
              selectedArrayList={value.text ? value.selectedList : []}
              textInputProps={{
                outlineColor:
                  fieldError !== undefined
                    ? theme.colors.error
                    : theme.colors.secondary
              }}
              textInputStyle={styles.dropdownFormField}
              textInputOutlineStyle={{
                borderWidth: fieldError !== undefined ? 2 : 1
              }}
              checkboxProps={{
                checkboxUncheckedColor: theme.colors.secondary
              }}
              theme={
                fieldError !== undefined && {
                  colors: {
                    onSurfaceVariant: theme.colors.error
                  }
                }
              }
            />
            {fieldError !== undefined && (
              <HelperText type="error" style={styles.formHelperText}>
                {fieldError
                  ? fieldError.message ||
                    validation.category[
                      fieldError.type as keyof typeof validation.category
                    ]
                  : ''}
              </HelperText>
            )}
          </View>
        )}
      />
      {quest ? (
        <View style={styles.rowCenter}>
          <Button
            mode="contained"
            loading={choose === 'remove' && loading}
            disabled={choose !== null || loading}
            buttonColor={theme.colors.error}
            style={styles.formGroupButton}
            onPress={handleOnRemove}
          >
            Delete
          </Button>
          <Button
            mode="contained"
            loading={choose === 'update' && loading}
            disabled={choose !== null || loading}
            style={styles.formGroupButton}
            onPress={handleSubmit((data: any) => {
              data.category = data.category.selectedList[0]._id;
              handleOnUpdate(data as UpdateQuestRequestData);
            })}
          >
            Update
          </Button>
        </View>
      ) : (
        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          style={styles.formButton}
          onPress={handleSubmit((data: any) => {
            data.category = data.category.selectedList[0]._id;
            handleOnSubmit(data as CreateQuestRequestData);
          })}
        >
          Add
        </Button>
      )}
      <DialogWindow
        title="Congratulations!"
        type="success"
        message={message}
        button="OK"
        onDismiss={() => {
          hideMessage();
          if (choose) {
            navigation.goBack();
          } else {
            navigation.navigate('QuestListTab', {
              screen: 'Quests',
              params: { updateQuests: true }
            });
          }
        }}
        onAgreePress={() => {
          hideMessage();
          if (choose) {
            navigation.goBack();
          } else {
            navigation.navigate('QuestListTab', {
              screen: 'Quests',
              params: { updateQuests: true }
            });
          }
        }}
      />
      <DialogWindow
        title="Attention!"
        type="error"
        message={error}
        button="OK"
        onDismiss={hideError}
        onAgreePress={hideError}
      />
      <DialogWindow
        title="Oops..."
        type="info"
        message={info}
        button="OK"
        onDismiss={hideInfo}
        onAgreePress={hideInfo}
      />
    </View>
  );
};

export default QuestFormScreen;
