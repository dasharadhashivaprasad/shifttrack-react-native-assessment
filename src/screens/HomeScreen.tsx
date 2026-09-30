
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  RootStackParamList,
} from '../navigation/types';

import {
  useAuth,
} from '../storage/AuthContext';

import {
  getShifts,
  setMockApiError,
  startShift,
  updateShift,
} from '../api/mockApi';

import {
  Shift,
} from '../types/models';

import {
  dateKey,
  durationLabel,
  durationMinutes,
  formatDateLabel,
  formatTime,
  startOfWeek,
  todayKey,
} from '../utils/time';

import {
  styles,
} from '../theme/styles';

import {
  colors,
} from '../theme/colors';

import {
  PrimaryButton,
  SecondaryButton,
} from '../components/PrimaryButton';

import {
  ErrorState,
  LoadingState,
} from '../components/StateMessage';


type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;


export function HomeScreen({
  navigation,
}: Props) {
  const {
    user,
    signOut,
  } = useAuth();

  const [
    shifts,
    setShifts,
  ] = useState<Shift[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const weekStart = useMemo(
    () => dateKey(startOfWeek()),
    [],
  );


  const load = useCallback(
    async () => {
      setError('');

      try {
        const data = await getShifts(weekStart);

        setShifts(data);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to load shifts.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [weekStart],
  );


  useEffect(
    () => {
      load();
    },
    [load],
  );


  useEffect(
    () => {
      const unsubscribe =
        navigation.addListener(
          'focus',
          load,
        );

      return unsubscribe;
    },
    [
      navigation,
      load,
    ],
  );


  const active = shifts.find(
    (shift) => !shift.endTime,
  );


  const endActive = async () => {
    if (!active) {
      return;
    }

    try {
      await updateShift(
        active.id,
        {
          endTime: new Date().toISOString(),
        },
      );

      await load();
    } catch (e) {
      Alert.alert(
        'Could not end shift',
        e instanceof Error
          ? e.message
          : 'Try again.',
      );
    }
  };


  const beginActive = async () => {
    try {
      const created = await startShift({
        date: todayKey(),
        breakMinutes: 0,
      });

      await load();

      navigation.navigate(
        'ActiveShift',
        {
          shiftId: created.id,
        },
      );
    } catch (e) {
      Alert.alert(
        'Could not start shift',
        e instanceof Error
          ? e.message
          : 'Try again.',
      );
    }
  };


  const simulateError = () => {
    setMockApiError(true);
    setError('');

    load().finally(
      () => {
        setMockApiError(false);
      },
    );
  };


  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            load();
          }}
        />
      }
    >
      {/* Header */}
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>
            This week
          </Text>

          <Text style={styles.subtitle}>
            Hi {user?.name ?? 'there'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={signOut}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: '800',
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>


      {/* Active / Start Shift Card */}
      {!active ? (
        <View style={styles.card}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: colors.text,
            }}
          >
            Ready to work?
          </Text>

          <Text
            style={[
              styles.muted,
              {
                marginTop: 6,
                marginBottom: 14,
              },
            ]}
          >
            Start a live shift and the timer will
            continue correctly after backgrounding
            or reopening.
          </Text>

          <PrimaryButton
            title="Start shift"
            onPress={beginActive}
          />
        </View>
      ) : (
        <View
          style={[
            styles.card,
            {
              borderColor: colors.primary,
            },
          ]}
        >
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '800',
                color: colors.text,
              }}
            >
              Active shift
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    colors.successBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: colors.success,
                  },
                ]}
              >
                LIVE
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.stat,
              {
                marginTop: 12,
              },
            ]}
          >
            {durationLabel(
              durationMinutes(active),
            )}
          </Text>

          <Text style={styles.small}>
            Started {formatTime(active.startTime)}
            {' · '}
            {active.breakMinutes}m break
          </Text>

          <View
            style={{
              marginTop: 14,
            }}
          >
            <PrimaryButton
              title="End shift"
              onPress={endActive}
            />
          </View>
        </View>
      )}


      {/* Create Shift */}
      <PrimaryButton
        title="Create shift"
        onPress={() =>
          navigation.navigate(
            'CreateShift',
          )
        }
      />


      {/* Loading */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={load}
        />
      ) : shifts.length === 0 ? (
        /* Empty State */
        <View style={styles.empty}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: colors.text,
            }}
          >
            No shifts yet
          </Text>

          <Text
            style={[
              styles.muted,
              {
                marginTop: 7,
                textAlign: 'center',
              },
            ]}
          >
            Create your first shift for this week.
          </Text>
        </View>
      ) : (
        /* Shift List */
        shifts.map(
          (shift) => (
            <View
              key={shift.id}
              style={styles.card}
            >
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '800',
                    color: colors.text,
                  }}
                >
                  {formatDateLabel(
                    shift.date,
                  )}
                </Text>

                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        shift.endTime
                          ? colors.warningBg
                          : colors.successBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          shift.endTime
                            ? colors.warning
                            : colors.success,
                      },
                    ]}
                  >
                    {shift.endTime
                      ? 'COMPLETED'
                      : 'ACTIVE'}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  marginTop: 10,
                  color: colors.text,
                }}
              >
                {formatTime(
                  shift.startTime,
                )}

                {' → '}

                {shift.endTime
                  ? formatTime(
                      shift.endTime,
                    )
                  : 'Now'}
              </Text>

              <Text style={styles.small}>
                Break {shift.breakMinutes}m
                {' · '}
                Total{' '}
                {durationLabel(
                  durationMinutes(
                    shift,
                  ),
                )}
              </Text>
            </View>
          ),
        )
      )}


      {/* Test Error State */}
      <SecondaryButton
        title="Test error state"
        onPress={simulateError}
      />
    </ScrollView>
  );
}

