<!-- Similar structure to LineChart.vue, but with type: 'doughnut' --><template>
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
    type: 'doughnut',
    data: props.chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%', // Make it a doughnut
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          padding: 10,
          cornerRadius: 8,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
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