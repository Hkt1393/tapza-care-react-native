import type React from 'react';
import { Pressable, Text, View } from 'react-native';

import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';
import Loader from '../../components/Loader';
import ScreenContainer from '../../components/ScreenContainer';
import TextInput from '../../components/TextInput';
import type { ExampleItem } from '../../types';
import styles from './styles';

export interface ExampleScreenViewProps {
  items: ExampleItem[];
  selectedItem: ExampleItem | null;
  searchTerm: string;
  isLoading: boolean;
  errorMessage: string | null;
  onLoadData: () => void;
  onSearchChange: (value: string) => void;
  onSelectItem: (item: ExampleItem) => void;
  onReset: () => void;
}

const ExampleScreenView = ({
  items,
  selectedItem,
  searchTerm,
  isLoading,
  errorMessage,
  onLoadData,
  onSearchChange,
  onSelectItem,
  onReset,
}: ExampleScreenViewProps): React.ReactElement => {
  if (isLoading) {
    return <Loader message="Loading example data..." />;
  }

  if (errorMessage) {
    return (
      <ErrorView
        title="Sample request failed"
        message={errorMessage}
        onRetry={onLoadData}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No results"
        message="No items match your current search. Try loading the sample data again."
        actionLabel="Load data"
        onActionPress={onLoadData}
      />
    );
  }

  return (
    <ScreenContainer scrollable style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Example Screen</Text>
        <Text style={styles.subtitle}>
          Demonstrates the MVVM pattern, service calls, and reusable UI components.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          label="Search items"
          value={searchTerm}
          onChangeText={onSearchChange}
          placeholder="Filter by title or body"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.searchInput}
        />
      </View>

      <View style={styles.primaryCard}>
        <Text style={styles.cardTitle}>Selected item</Text>
        {selectedItem ? (
          <>
            <Text style={styles.itemTitle}>{selectedItem.title}</Text>
            <Text style={styles.itemBody}>{selectedItem.body}</Text>
            <Text style={styles.metaText}>User {selectedItem.userId}</Text>
          </>
        ) : (
          <Text style={styles.noSelection}>No item selected</Text>
        )}
      </View>

      <View style={styles.actionsRow}>
        <Button title="Reload data" onPress={onLoadData} style={styles.actionButton} />
        <Button
          title="Reset"
          variant="secondary"
          onPress={onReset}
          style={styles.actionButton}
        />
      </View>

      <Text style={styles.sectionTitle}>Available items</Text>
      {items.map((item) => {
        const isSelected = selectedItem?.id === item.id;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            onPress={() => onSelectItem(item)}
            style={({ pressed }) => [
              styles.itemCard,
              isSelected && styles.itemCardSelected,
              pressed && styles.itemCardPressed,
            ]}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemBody}>{item.body}</Text>
            <Text style={styles.metaText}>ID {item.id}</Text>
          </Pressable>
        );
      })}
    </ScreenContainer>
  );
};

export default ExampleScreenView;
