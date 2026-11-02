// Importa React e hooks de estado
import React, { useState } from "react";
// Importa componentes visuais do React Native
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

// Componente principal da aba inicial
export default function HabitBreakerScreen() {
  // "step" controla em qual etapa da tela estamos:
  // "welcome" -> tela inicial
  // "choose"  -> escolher vício
  // "setup"   -> informar quantidade e preço
  const [step, setStep] = useState<"welcome" | "choose" | "setup">("welcome");

  // Guarda qual vício o usuário escolheu (cigarro, bebida, etc.)
  const [selectedAddiction, setSelectedAddiction] = useState<string | null>(null);

  // Campos do formulário da etapa "setup"
  const [unitsPerDay, setUnitsPerDay] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");

  // Lista de vícios disponíveis
  const addictions = [
    { name: "Cigarro", emoji: "🚬" },
    { name: "Bebida", emoji: "🍺" },
    { name: "Cannabis", emoji: "🍃" },
    { name: "Cocaína/Outros", emoji: "💊" },
    { name: "Comida lixo", emoji: "🍔" },
    { name: "Outro", emoji: "❓" },
  ];

  // Quando o usuário escolhe um vício na etapa "choose"
  const handleSelectAddiction = (name: string) => {
    setSelectedAddiction(name); // salva qual vício foi escolhido
    setStep("setup");           // vai para a próxima etapa (setup)
  };

  // Quando o usuário aperta "Calcular gasto atual"
  const handleCalculate = () => {
    // Validação simples para garantir que os campos foram preenchidos
    if (!unitsPerDay || !unitPrice) {
      Alert.alert(
        "Atenção",
        "Preencha quantas unidades usa por dia e o valor por unidade."
      );
      return;
    }

    // Converte texto para número (trocando vírgula por ponto caso o usuário use)
    const units = Number(unitsPerDay.replace(",", "."));
    const price = Number(unitPrice.replace(",", "."));

    if (isNaN(units) || isNaN(price)) {
      Alert.alert("Erro", "Use apenas números (ex.: 10 ou 10.5).");
      return;
    }

    // Cálculos de gasto aproximado
    const dailyCost = units * price;      // por dia
    const weeklyCost = dailyCost * 7;     // por semana
    const monthlyCost = dailyCost * 30;   // por mês (aproximado)
    const yearlyCost = dailyCost * 365;   // por ano (aproximado)

    // Monta mensagem com os resultados
    const addictionLabel = selectedAddiction ?? "seu vício";
    const message =
      `Com o vício: ${addictionLabel}\n\n` +
      `Gasto aproximado:\n` +
      `• Por dia: €${dailyCost.toFixed(2)}\n` +
      `• Por semana: €${weeklyCost.toFixed(2)}\n` +
      `• Por mês: €${monthlyCost.toFixed(2)}\n` +
      `• Por ano: €${yearlyCost.toFixed(2)}\n\n` +
      `Na próxima versão do app, vamos usar isso para mostrar\n` +
      `quanto dinheiro você pode economizar se reduzir esse hábito.`;

    // Mostra os valores num alerta
    Alert.alert("Estimativa de gastos", message);
  };

  // ====== RENDERIZAÇÃO CONDICIONAL: cada etapa mostra uma tela diferente ======

  // Etapa 1: tela de boas-vindas
  if (step === "welcome") {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.title}>Habit Breaker</Text>
        <Text style={styles.subtitle}>Reduzindo vícios passo a passo 🚭💪</Text>

        <Text style={styles.text}>
          Vamos começar escolhendo um vício para trabalhar e ver quanto ele
          está te custando por dia, mês e ano.
        </Text>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => setStep("choose")}
        >
          <Text style={styles.buttonPrimaryText}>Começar ➜</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Etapa 2: escolher qual vício reduzir
  if (step === "choose") {
    return (
      <View style={styles.containerTop}>
        <Text style={styles.title}>Qual vício você quer reduzir?</Text>

        {addictions.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.buttonOption}
            onPress={() => handleSelectAddiction(item.name)}
          >
            <Text style={styles.buttonOptionText}>
              {item.emoji} {item.name}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => setStep("welcome")}
        >
          <Text style={styles.buttonSecondaryText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Etapa 3: configurar quantidade e preço do vício selecionado
  return (
    <View style={styles.containerForm}>
      <Text style={styles.title}>Configurar vício</Text>
      <Text style={styles.subtitle}>
        Vício selecionado:{" "}
        <Text style={styles.highlight}>
          {selectedAddiction ?? "Seu vício"}
        </Text>
      </Text>

      <Text style={styles.label}>Quantas unidades você usa por dia?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 20 cigarros, 3 latas..."
        keyboardType="numeric"
        value={unitsPerDay}
        onChangeText={setUnitsPerDay}
      />

      <Text style={styles.label}>Quanto custa cada unidade (em €)?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: 15 (maço), 3 (lata)..."
        keyboardType="numeric"
        value={unitPrice}
        onChangeText={setUnitPrice}
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleCalculate}>
        <Text style={styles.buttonPrimaryText}>Calcular gasto atual</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => setStep("choose")}
      >
        <Text style={styles.buttonSecondaryText}>Trocar vício</Text>
      </TouchableOpacity>
    </View>
  );
}

// =================== ESTILOS ===================
const styles = StyleSheet.create({
  containerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  containerTop: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  highlight: {
    fontWeight: "bold",
  },
  buttonPrimary: {
    marginTop: 10,
    backgroundColor: "#333333",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonSecondary: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: "#333333",
    fontSize: 16,
  },
  buttonOption: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#333333",
    marginBottom: 10,
    alignItems: "center",
  },
  buttonOptionText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
  },
});
