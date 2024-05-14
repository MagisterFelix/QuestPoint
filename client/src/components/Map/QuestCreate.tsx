import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Button,
  Dialog,
  HelperText,
  Icon,
  Provider as PaperProvider,
  TextInput
} from 'react-native-paper';

import { useAxios } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import ErrorPop from '@/components/Map/ErrorPop';
import SuccessPop from '@/components/Map/SuccessPop';
import { DeprecatedCategoryData } from '@/types/Map/DeprecatedCategoryData';
import { DeprecatedQuestRequestData } from '@/types/request';
import {
  DeprecatedCategoriesResponseData,
  ResponseData
} from '@/types/response';

const QuestCreate = ({
  latitude,
  longitude
}: {
  latitude: number | undefined;
  longitude: number | undefined;
}) => {
  const [categories, setCategories] = useState<DeprecatedCategoryData[]>([]);
  const [firstVisit, setVisit] = useState(true);
  const [{ loading }, request] = useAxios(
    {
      timeout: 10000
    },
    {
      manual: true
    }
  );
  const [error, setError] = useState('');
  const hideError = () => setTimeout(() => setError(''), 5500);
  const { control, handleSubmit, setError: setFieldError } = useForm();

  const [questRequestData, setRequestQuestData] =
    useState<DeprecatedQuestRequestData>();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const showConfirmModal = () => setConfirmModalVisible(true);
  const hideConfirmModal = () => setConfirmModalVisible(false);

  const create = async (data: DeprecatedQuestRequestData) => {
    try {
      const response: AxiosResponse<ResponseData> = await request({
        url: ENDPOINTS.deprecated_quest,
        method: 'POST',
        data: data
      });
      setModalVisible(false);
      handleSuccess();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data.details[0].non_field_errors);
      if (axiosError.code === AxiosError.ERR_NETWORK) {
        alert('Timeout!');
      }
    }
  };

  const handleOnSubmit = async (data: DeprecatedQuestRequestData) => {
    Keyboard.dismiss();
    await create(data);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response: AxiosResponse<DeprecatedCategoriesResponseData> =
          await request({
            url: ENDPOINTS.deprecated_categories,
            method: 'GET'
          });

        setCategories(response.data.data);
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.code === AxiosError.ERR_NETWORK) {
          alert('Timeout!');
        }
      }
    };

    getCategories();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [reward, setReward] = useState(0);
  const rewardInputRef = useRef<any>(null);
  const adjustments = [-20, -5, -1, 1, 5, 20];
  const increaseReward = (value: number) => {
    setReward((prevReward) => Math.max(0, prevReward + value));
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3500);
  };

  return (
    <PaperProvider>
      <View style={styles.center}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon source="plus-circle" size={42} color="#dae2ff" />
        </TouchableOpacity>
        <SuccessPop isVisible={showSuccess} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Icon source="close-circle" size={42} color="black" />
          </TouchableOpacity>
          <HelperText
            type="error"
            visible={
              (!firstVisit && latitude === undefined) || longitude === undefined
            }
          >
            Geolocation Error. Try reload application
          </HelperText>
          <Text style={styles.textLabel}>Create quest</Text>
          <View>
            <Controller
              name="title"
              control={control}
              defaultValue=""
              rules={{
                required: true
              }}
              render={({
                field: { onChange, value },
                fieldState: { error: fieldError }
              }) => (
                <>
                  <TextInput
                    style={styles.inputTitle}
                    label="Title"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    right={<TextInput.Icon icon="pencil" />}
                    maxLength={40}
                  />

                  <HelperText type="error" visible={fieldError !== undefined}>
                    Please provide a valid title.
                  </HelperText>
                </>
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{
                required: true
              }}
              render={({
                field: { onChange, value },
                fieldState: { error: fieldError }
              }) => (
                <>
                  <TextInput
                    style={styles.inputDescription}
                    label="Description"
                    mode="outlined"
                    multiline
                    value={value}
                    onChangeText={onChange}
                    right={<TextInput.Icon icon="note-edit-outline" />}
                    maxLength={200}
                    numberOfLines={4}
                  />

                  <HelperText type="error" visible={fieldError !== undefined}>
                    Please provide a valid description.
                  </HelperText>
                </>
              )}
            />
          </View>

          <Text style={styles.textLabel}>Reward</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                rewardInputRef.current?.blur();
                setTimeout(() => rewardInputRef.current?.focus(), 100);
              }}
            >
              <Text style={styles.rewardText}>{reward} QP</Text>
              <TextInput
                ref={rewardInputRef}
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  opacity: 0
                }}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setReward(numericValue ? parseInt(numericValue, 10) : 0);
                }}
                value={reward.toString()}
                maxLength={10}
              />
            </TouchableOpacity>
            {reward > 0 && (
              <TouchableOpacity onPress={() => setReward(0)}>
                <Icon source="eraser" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.rewardContainer}>
            {adjustments.map((adjustment) => (
              <Button
                key={adjustment}
                mode="outlined"
                onPress={() => increaseReward(adjustment)}
                style={styles.button}
                compact
              >
                {adjustment >= 0 ? `+${adjustment}` : adjustment}
              </Button>
            ))}
          </View>
          <HelperText type="error" visible={reward === 0 && !firstVisit}>
            Reward can't be zero
          </HelperText>
          <Text style={styles.textLabel}>Category</Text>

          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              style={styles.categoryScrollView}
              showsHorizontalScrollIndicator={false}
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category
                      ? styles.selectedCategory
                      : null
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.categoryText}>{category.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <HelperText
            type="error"
            visible={selectedCategory == null && !firstVisit}
          >
            Category should be set
          </HelperText>

          <Dialog visible={confirmModalVisible} onDismiss={hideConfirmModal}>
            <Dialog.Title>Create quest?</Dialog.Title>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  handleOnSubmit(questRequestData!);
                  hideConfirmModal();
                }}
              >
                Yes
              </Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={hideConfirmModal}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>

          <ErrorPop error={error} />
          <View style={styles.finishContainer}>
            <TouchableOpacity
              onPress={handleSubmit((data: any) => {
                setVisit(false);

                if (
                  latitude !== undefined &&
                  longitude !== undefined &&
                  reward &&
                  selectedCategory
                ) {
                  const toServer: DeprecatedQuestRequestData = {
                    title: data.title,
                    description: data.description,
                    category: selectedCategory.title,
                    reward: reward,
                    latitude: latitude,
                    longitude: longitude
                  };
                  setRequestQuestData(toServer);
                  showConfirmModal();
                }
                hideError();
              })}
            >
              <Icon source="plus-circle" size={56} color="grey" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10
  },
  categoryScrollView: {
    flexDirection: 'row',
    marginTop: 20
  },
  categoryItem: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 20
  },
  selectedCategory: {
    backgroundColor: 'grey'
  },
  categoryText: {
    color: 'white'
  },
  categoryContainer: {
    flexDirection: 'row'
  },
  inputTitle: {
    margin: 20
  },
  inputDescription: {
    margin: 20
  },
  textLabel: {
    fontSize: 26,
    textAlign: 'center'
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  rewardText: {
    fontSize: 34,
    marginHorizontal: 10,
    textAlign: 'center'
  },
  button: {
    margin: 5
  },
  finishContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto'
  }
});

export default QuestCreate;
