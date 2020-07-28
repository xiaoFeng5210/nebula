<template>
    <div ref="setMealChart" class="set__meal__chart">
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
  name: 'setMealChart',
  props: {
    labelShow: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      const _this = this;
      const myChart = echarts.init(_this.$refs.setMealChart);
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
          {
            name: '空间',
            type: 'pie',
            radius: ['25%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: _this.labelShow,
              position: 'inside',
              fontSize: 10
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 570, name: '文档'},
              {value: 310, name: '剩余'},
              {value: 100, name: '其他'},
              {value: 1500, name: '模型'}
            ]
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.set__meal__chart {
  width: 100%;
  height: 100%;
}
</style>
