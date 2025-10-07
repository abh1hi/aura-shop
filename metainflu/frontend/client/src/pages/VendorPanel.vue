<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Total Sales</h3>
        <p>$12,345</p>
      </div>
      <div class="dashboard-card">
        <h3>Total Orders</h3>
        <p>123</p>
      </div>
      <div class="dashboard-card">
        <h3>New Orders</h3>
        <p>5</p>
      </div>
      <div class="dashboard-card">
        <h3>Pending Returns</h3>
        <p>2</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
}

.dashboard-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.dashboard-card p {
  font-size: 2rem;
  font-weight: 700;
}
</style>
