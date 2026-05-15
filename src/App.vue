<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        Analytics
      </div>

      <div class="menu">
        <div class="menu-item active">Дашборд</div>
        <div class="menu-item">Отчеты</div>
        <div class="menu-item">Продажи</div>
        <div class="menu-item">Клиенты</div>
      </div>
    </aside>

    <main class="content">
      <div class="header">
        <h1>Дашборд</h1>
      </div>

      <div class="filters">
        <el-date-picker
          type="daterange"
          start-placeholder="Дата начала"
          end-placeholder="Дата конца"
        />

        <el-select placeholder="Категория">
          <el-option label="Все категории" value="all" />
        </el-select>

        <el-button type="primary">
          Применить
        </el-button>
      </div>

      <div class="chart-block">
        График
      </div>

      <div class="table-block">
        Таблица
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #f5f9ff;
}

.sidebar {
  width: 240px;
  background: linear-gradient(
    180deg,
    #1677ff,
    #0b63f6
  );

  color: white;

  padding: 24px;
}

.logo {
  font-size: 28px;
  font-weight: 700;

  margin-bottom: 40px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-item {
  padding: 14px 18px;
  border-radius: 12px;

  cursor: pointer;

  transition: 0.2s;
}

.menu-item:hover {
  background: rgba(255,255,255,0.12);
}

.menu-item.active {
  background: rgba(255,255,255,0.18);
}

.content {
  flex: 1;

  padding: 24px;

  overflow: auto;
}

.header {
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 12px;

  padding: 20px;

  background: white;

  border-radius: 16px;

  margin-bottom: 24px;
}

.chart-block,
.table-block {
  background: white;

  border-radius: 16px;

  padding: 20px;

  margin-bottom: 24px;

  min-height: 300px;
}
</style>