<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    default: () => ({
      labels: [],
      datasets: []
    })
  },
  chartOptions: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'line' // Can be 'line', 'bar', 'doughnut' etc.
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: props.type,
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Default to false, can be overridden by chartOptions
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          padding: 10,
          cornerRadius: 8,
          backgroundColor: 'rgba(0,0,0,0.7)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6C757D' // gray-text
          }
        },
        y: {
          grid: {
            color: '#E0E0E0', // gray-border
            borderDash: [5, 5]
          },
          ticks: {
            color: '#6C757D', // gray-text
            callback: function(value) {
              return '$' + value; // Example for currency
            }
          }
        }
      },
      ...props.chartOptions // Allow overriding default options
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.chartData, () => {
  if (chartInstance) {
    chartInstance.data = props.chartData;
    chartInstance.update();
  } else {
    createChart();
  }
}, { deep: true });

watch(() => props.chartOptions, () => {
  if (chartInstance) {
    chartInstance.options = {
      ...chartInstance.options, // preserve some defaults
      ...props.chartOptions
    };
    chartInstance.update();
  } else {
    createChart();
  }
}, { deep: true });
</script>

<style scoped>
/* Ensure canvas fills its container */
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>