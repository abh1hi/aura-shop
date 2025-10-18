<!-- Similar structure to LineChart.vue, but with type: 'bar' --><template>
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
    type: 'bar',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          padding: 10,
          cornerRadius: 8,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6C757D'
          },
          barPercentage: 0.6, // Adjust bar width
          categoryPercentage: 0.7
        },
        y: {
          grid: {
            color: '#E0E0E0',
            borderDash: [5, 5]
          },
          ticks: {
            color: '#6C757D',
            callback: function(value) {
              return '$' + value;
            }
          }
        }
      },
      ...props.chartOptions
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
      ...chartInstance.options,
      ...props.chartOptions
    };
    chartInstance.update();
  } else {
    createChart();
  }
}, { deep: true });
</script>