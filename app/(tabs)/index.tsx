import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@habit-breaker/progress-v1';
type Settings = { baseline: number; packSize: number; packPrice: number };
type Data = { settings: Settings; days: Record<string, number> };

function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function parseNumber(value: string) {
  const normalized = value.trim().replace(',', '.');
  return /^\d+(?:\.\d+)?$/.test(normalized) ? Number(normalized) : NaN;
}
function validData(value: unknown): value is Data {
  if (!value || typeof value !== 'object') return false;
  const data = value as Data;
  return !!data.settings && Number.isFinite(data.settings.baseline) && data.settings.baseline > 0 &&
    Number.isInteger(data.settings.packSize) && data.settings.packSize > 0 &&
    Number.isFinite(data.settings.packPrice) && data.settings.packPrice >= 0 &&
    !!data.days && typeof data.days === 'object' && !Array.isArray(data.days) &&
    Object.entries(data.days).every(([date, count]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isInteger(count) && count >= 0);
}

export default function HabitBreakerScreen() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveInProgress = useRef(false);
  const [editing, setEditing] = useState(false);
  const [baseline, setBaseline] = useState('');
  const [packSize, setPackSize] = useState('20');
  const [packPrice, setPackPrice] = useState('');
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [today, setToday] = useState(localDate);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (!validData(parsed)) throw new Error('invalid data');
        setData(parsed);
      }
    }).catch(() => setError('Não foi possível carregar os dados salvos. Feche e abra o app novamente.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setToday(localDate()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function save(next: Data) {
    if (saveInProgress.current) return false;
    saveInProgress.current = true;
    setSaving(true);
    setError('');
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setData(next);
      return true;
    } catch {
      setError('Não foi possível salvar. Tente novamente.');
      return false;
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  async function saveSettings() {
    const initial = parseNumber(baseline);
    const size = parseNumber(packSize);
    const price = parseNumber(packPrice);
    if (!Number.isFinite(initial) || initial <= 0 || !Number.isFinite(size) || !Number.isInteger(size) || size <= 0 || !Number.isFinite(price) || price < 0) {
      setError('Informe o consumo inicial maior que zero, a quantidade inteira de cigarros por maço e um preço válido.');
      return;
    }
    if (await save({ settings: { baseline: initial, packSize: size, packPrice: price }, days: data?.days ?? {} })) setEditing(false);
  }

  function openSettings() {
    if (data) {
      setBaseline(String(data.settings.baseline));
      setPackSize(String(data.settings.packSize));
      setPackPrice(String(data.settings.packPrice));
    }
    setError('');
    setEditing(true);
  }

  async function resetData() {
    if (saveInProgress.current) return;
    saveInProgress.current = true;
    setSaving(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setData(null);
      setBaseline('');
      setPackSize('20');
      setPackPrice('');
      setError('');
      setConfirmReset(false);
    } catch {
      setError('Não foi possível apagar os dados. Tente novamente.');
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /><Text>Carregando seus dados...</Text></View>;
  if (!data && error && !editing) return <View style={styles.center}><Text accessibilityRole="alert">{error}</Text></View>;

  if (!data || editing) return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{data ? 'Editar configuração' : 'Vamos começar 🚭'}</Text>
      <Text style={styles.subtitle}>Esses valores ajudam a comparar seu consumo e estimar seus gastos.</Text>
      <Text style={styles.note}>Seus registros ficam neste aparelho, sem criptografia adicional do aplicativo. Eles não são sincronizados com uma conta.</Text>
      <Text style={styles.label}>Quantos cigarros você fumava por dia, em média?</Text>
      <TextInput accessibilityLabel="Consumo inicial por dia" style={styles.input} keyboardType="decimal-pad" placeholder="Ex.: 20" value={baseline} onChangeText={setBaseline} />
      <Text style={styles.label}>Quantos cigarros há em cada maço?</Text>
      <TextInput accessibilityLabel="Cigarros por maço" style={styles.input} keyboardType="number-pad" placeholder="Ex.: 20" value={packSize} onChangeText={setPackSize} />
      <Text style={styles.label}>Quanto custa um maço (em €)?</Text>
      <TextInput accessibilityLabel="Preço do maço em euros" style={styles.input} keyboardType="decimal-pad" placeholder="Ex.: 15" value={packPrice} onChangeText={setPackPrice} />
      {data && <Text style={styles.note}>Ao alterar os valores, as comparações anteriores serão recalculadas usando a nova configuração.</Text>}
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <TouchableOpacity accessibilityRole="button" disabled={saving} style={styles.primary} onPress={saveSettings}><Text style={styles.primaryText}>{saving ? 'Salvando...' : 'Salvar e continuar'}</Text></TouchableOpacity>
      {data && <TouchableOpacity accessibilityRole="button" style={styles.secondary} onPress={() => { setEditing(false); setError(''); }}><Text>Cancelar</Text></TouchableOpacity>}
    </ScrollView>
  );

  const todayCount = data.days[today];
  const initial = data.settings.baseline;
  const costPerCigarette = data.settings.packPrice / data.settings.packSize;
  const reduction = todayCount === undefined ? 0 : initial - todayCount;
  const percent = todayCount === undefined ? 0 : ((initial - todayCount) / initial) * 100;
  const history = Object.entries(data.days).sort(([a], [b]) => b.localeCompare(a)).slice(0, 7);
  const monthEntries = Object.entries(data.days).filter(([date]) => date.slice(0, 7) === today.slice(0, 7) && date <= today);
  const monthTotal = monthEntries.reduce((sum, [, count]) => sum + count, 0);
  const dailyDifference = reduction * costPerCigarette;
  const updateCount = (count: number) => save({ ...data, days: { ...data.days, [today]: count } });

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Habit Breaker 🚭</Text>
      <Text style={styles.subtitle}>Um passo de cada vez.</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>Hoje</Text>
        <Text style={styles.count}>{todayCount === undefined ? '—' : todayCount}</Text>
        <Text style={styles.centerText}>{todayCount === undefined ? 'Nenhum registro para hoje' : 'cigarros registrados'}</Text>
        <TouchableOpacity accessibilityRole="button" disabled={saving} style={styles.primary} onPress={() => updateCount((todayCount ?? 0) + 1)}><Text style={styles.primaryText}>+ Registrar cigarro</Text></TouchableOpacity>
        {todayCount === undefined ? <TouchableOpacity accessibilityRole="button" disabled={saving} style={styles.secondary} onPress={() => updateCount(0)}><Text>Registrar dia sem cigarros</Text></TouchableOpacity> :
          <TouchableOpacity accessibilityRole="button" disabled={saving || todayCount === 0} style={styles.secondary} onPress={() => updateCount(Math.max(0, todayCount - 1))}><Text>− Corrigir registro</Text></TouchableOpacity>}
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Comparação com seu consumo inicial</Text>
        <Text>Referência: {initial} cigarros por dia</Text>
        {todayCount === undefined ? <Text style={styles.note}>Registre seu consumo de hoje para ver a comparação.</Text> : <>
          <Text style={styles.metric}>{reduction >= 0 ? `${reduction} a menos` : `${Math.abs(reduction)} a mais`} ({Math.abs(percent).toFixed(0)}%)</Text>
          <Text style={dailyDifference < 0 ? styles.negative : undefined}>Saldo estimado hoje: {dailyDifference < 0 ? '−' : ''}€{Math.abs(dailyDifference).toFixed(2)}</Text>
          {dailyDifference < 0 && <Text style={styles.note}>Valor acima do gasto correspondente ao seu consumo inicial.</Text>}
          <Text style={styles.note}>Estimativa parcial baseada nos registros de hoje e no preço configurado. Continue registrando ao longo do dia.</Text>
        </>}
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Consumo deste mês</Text>
        {monthEntries.length === 0 ? <Text>Ainda não há registros neste mês.</Text> : <>
          <Text>Cigarros registrados: {monthTotal}</Text>
          <Text style={styles.metric}>Gasto estimado: €{(monthTotal * costPerCigarette).toFixed(2)}</Text>
          <Text style={styles.note}>Calculado pelos cigarros registrados neste mês e pelo preço atual por cigarro. Dias sem registro não entram no total.</Text>
        </>}
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Últimos dias registrados</Text>
        {history.length === 0 ? <Text>Ainda não há registros.</Text> : history.map(([date, count]) => <View style={styles.row} key={date}><Text>{date.split('-').reverse().join('/')}{date === today ? ' (hoje)' : ''}</Text><Text>{count} {count === 1 ? 'cigarro' : 'cigarros'}</Text></View>)}
        <Text style={styles.note}>Dias sem registro não aparecem no histórico.</Text>
      </View>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <TouchableOpacity accessibilityRole="button" style={styles.secondary} onPress={openSettings}><Text>Editar configuração</Text></TouchableOpacity>
      {!confirmReset ? <TouchableOpacity accessibilityRole="button" style={styles.secondary} onPress={() => setConfirmReset(true)}><Text>Apagar meus dados</Text></TouchableOpacity> : <View style={styles.card}>
        <Text>Isso apagará sua configuração e todo o histórico deste aparelho.</Text>
        <TouchableOpacity accessibilityRole="button" disabled={saving} style={styles.primary} onPress={resetData}><Text style={styles.primaryText}>Confirmar exclusão</Text></TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.secondary} onPress={() => setConfirmReset(false)}><Text>Cancelar</Text></TouchableOpacity>
      </View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, backgroundColor: '#f7f8f6', paddingHorizontal: 20, paddingTop: 55, paddingBottom: 36 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
  title: { fontSize: 26, fontWeight: '700', color: '#20372f', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#4b5c55', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#20372f' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#c9d3cd', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 20 },
  primary: { backgroundColor: '#245c48', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondary: { padding: 14, borderColor: '#9eafa5', borderWidth: 1, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#e1e8e3' },
  heading: { fontSize: 18, fontWeight: '700', color: '#20372f', marginBottom: 12 },
  count: { fontSize: 48, fontWeight: '700', color: '#245c48', textAlign: 'center' },
  centerText: { textAlign: 'center', color: '#4b5c55' },
  metric: { fontSize: 19, fontWeight: '700', marginVertical: 10, color: '#245c48' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  note: { color: '#596a60', fontSize: 13, lineHeight: 19, marginTop: 12, marginBottom: 8 },
  error: { color: '#a11', marginVertical: 10 },
  negative: { color: '#a11', fontWeight: '700' },
});
