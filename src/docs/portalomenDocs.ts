import type { DocsSection } from './types'

export const portalomenDocs: DocsSection[] = [
  {
    id: 'overview',
    title: 'Обзор проекта',
    description: 'Portalomen строится как frontend platform для enterprise-инструментов, аналитики и будущей no-code админки.',
    blocks: [
      {
        type: 'text',
        body: [
          'Главная идея проекта: frontend не должен содержать отдельную Vue-страницу под каждый инструмент. Инструмент описывается конфигом, данными и состоянием, а интерфейс собирается runtime-рендерером.',
          'Пуаро, Мантика и будущие инструменты должны храниться в БД. Пока backend не подключен, роль БД выполняют JSON-файлы в src/db/tools.'
        ]
      },
      {
        type: 'list',
        title: 'Базовый поток',
        items: [
          'Пользователь открывает каталог инструментов.',
          'Frontend получает список доступных инструментов из registry/API.',
          'Пользователь выбирает инструмент.',
          'ToolRuntimeView загружает конфиг по slug.',
          'LayoutRenderer и ComponentRenderer собирают страницу из layout areas и components.',
          'Состояние инструмента сохраняется в localStorage через общий persistence helper.'
        ]
      },
      {
        type: 'code',
        title: 'Runtime flow',
        language: 'text',
        code: '/tools -> fetchToolCatalog() -> карточки инструментов\n/tools/:slug -> fetchToolConfig(slug) -> validateToolConfig() -> ToolRuntimeView -> ToolLayoutRenderer -> ToolComponentRenderer'
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Архитектура',
    description: 'Основные слои проекта и ответственность каждого слоя.',
    blocks: [
      {
        type: 'list',
        title: 'Слои',
        items: [
          'src/components/ui: базовые UI-компоненты без бизнес-логики.',
          'src/components/layout: общий shell приложения, sidebar, topbar.',
          'src/components/tools: runtime-компоненты для каталога и инструментов.',
          'src/views: страницы маршрутов, которые связывают layout и данные.',
          'src/db/tools: временные JSON-конфиги инструментов, будущая замена на PostgreSQL/API.',
          'src/services: загрузчики данных и registry-слой.',
          'src/types: TypeScript-типы и runtime validation.',
          'src/composables: переиспользуемая логика вроде CSV export и persisted state.'
        ]
      },
      {
        type: 'code',
        title: 'Ключевая схема',
        language: 'text',
        code: 'Tool JSON config\n  -> toolRegistry\n  -> validateToolConfig\n  -> ToolRuntimeView\n  -> ToolLayoutRenderer\n  -> ToolComponentRenderer\n  -> UI Kit / ECharts / Element Plus'
      }
    ]
  },
  {
    id: 'routing',
    title: 'Роутинг',
    description: 'Маршруты приложения через vue-router.',
    blocks: [
      {
        type: 'list',
        title: 'Текущие маршруты',
        items: [
          '/: DashboardView, текущий dashboard продаж.',
          '/tools: ToolsCatalogView, каталог доступных инструментов.',
          '/tools/:slug: ToolRuntimeView, универсальная страница инструмента.',
          '/ui: UIShowcase, визуализация UI Kit.'
        ]
      },
      {
        type: 'text',
        body: [
          'В sidebar не должны попадать отдельные инструменты. Sidebar ведет в раздел Инструменты, а доступные инструменты показываются карточками в каталоге.',
          'Это нужно для будущего разграничения доступа: backend сможет отдавать пользователю только те инструменты, на которые у него есть права.'
        ]
      }
    ]
  },
  {
    id: 'tool-config',
    title: 'ToolConfig',
    description: 'Контракт, по которому frontend собирает инструмент.',
    blocks: [
      {
        type: 'list',
        title: 'Основные поля',
        items: [
          'id, slug, title, version: идентификация и версия конфига.',
          'catalog: описание карточки инструмента в каталоге.',
          'navigation: label, icon, order для сортировки и будущих меню.',
          'persistence: ключи и флаги сохранения состояния.',
          'defaultState: состояние инструмента по умолчанию.',
          'layout: тип layout, density и список areas.',
          'dataSources: временные данные для графиков, таблиц и панелей.'
        ]
      },
      {
        type: 'code',
        title: 'Минимальная форма',
        language: 'ts',
        code: "type ToolConfig = {\n  id: string\n  slug: string\n  title: string\n  version: number\n  catalog: { description: string; accentColor: string }\n  navigation: { label: string; icon: string; order: number }\n  persistence: { key: string; state: boolean; configCache: boolean }\n  defaultState: Record<string, unknown>\n  layout: ToolLayoutConfig\n  dataSources: Record<string, ToolDataSource>\n}"
      }
    ]
  },
  {
    id: 'validation',
    title: 'Валидация конфигов',
    description: 'Легкая runtime-проверка JSON без внешних зависимостей.',
    blocks: [
      {
        type: 'text',
        body: [
          'TypeScript проверяет код на этапе разработки, но JSON из БД придет в runtime. Поэтому каждый конфиг должен проверяться перед тем, как попасть в renderer.',
          'Файл src/types/toolConfigValidation.ts проверяет обязательные поля, тип layout, components, filters, chart series, table columns и ссылки на dataSources.'
        ]
      },
      {
        type: 'list',
        title: 'Поведение',
        items: [
          'Валидные инструменты попадают в каталог.',
          'Невалидный инструмент не рендерится.',
          'ToolRuntimeView показывает ошибки конфига вместо пустого экрана.',
          'Позже этот слой можно заменить или усилить через zod.'
        ]
      }
    ]
  },
  {
    id: 'runtime',
    title: 'Tool Runtime',
    description: 'Универсальный слой рендеринга инструментов.',
    blocks: [
      {
        type: 'list',
        title: 'Компоненты runtime',
        items: [
          'ToolsCatalogView: страница каталога инструментов.',
          'ToolCatalogLayout: layout каталога с header и сеткой карточек.',
          'ToolCatalogCard: карточка инструмента.',
          'ToolRuntimeView: загружает конфиг и состояние инструмента.',
          'ToolLayoutRenderer: рендерит layout areas.',
          'ToolComponentRenderer: рендерит filters, chart, table, info-panel.'
        ]
      },
      {
        type: 'text',
        body: [
          'ToolComponentRenderer пока содержит несколько типов компонентов в одном файле. Следующий архитектурный шаг: разнести его на ToolFiltersRenderer, ToolChartRenderer, ToolTableRenderer и ToolInfoPanelRenderer, затем добавить ComponentRegistry.'
        ]
      }
    ]
  },
  {
    id: 'ui-kit',
    title: 'UI Kit',
    description: 'Portalomen UI Kit — стабильный слой поверх Element Plus и ECharts.',
    blocks: [
      {
        type: 'list',
        title: 'Компоненты',
        items: [
          'ButtonUI, InputUI, SelectUI, DateRangeUI, SearchInputUI: формы и фильтры.',
          'CardUI, SectionUI, FilterBarUI: композиция страниц.',
          'Chart.vue: общий wrapper для ECharts.',
          'DataTableUI: общий wrapper для readonly/analytical таблиц.',
          'ModalUI, TabsUI, BadgeUI, AlertUI и другие элементы интерфейса.'
        ]
      },
      {
        type: 'text',
        body: [
          'UI-компоненты не должны знать о dashboard, Пуаро, Мантике, API или Pinia store. Они принимают props и события, а бизнес-логика живет выше.'
        ]
      }
    ]
  },
  {
    id: 'charts',
    title: 'Графики',
    description: 'Общий компонент Chart.vue нормализует внешний вид графиков.',
    blocks: [
      {
        type: 'list',
        title: 'Возможности',
        items: [
          'Типы line и bar.',
          'Смешанные series: например bar + line.',
          'Легенда и управление ее позицией.',
          'Несколько Y-осей.',
          'dashed lines, area, custom colors, height и mobileHeight.',
          'pointClick event для выбора точки графика.'
        ]
      },
      {
        type: 'code',
        title: 'Пример',
        language: 'vue',
        code: '<Chart\n  :labels="labels"\n  :series="series"\n  :legend="true"\n  legend-position="top"\n  :height="420"\n/>'
      }
    ]
  },
  {
    id: 'tables',
    title: 'Таблицы',
    description: 'DataTableUI нужен для плотных аналитических таблиц.',
    blocks: [
      {
        type: 'list',
        title: 'Текущее состояние',
        items: [
          'DataTableUI принимает data, columns, height, border, selectable, density.',
          'Поддерживает форматирование number, money, percent, text.',
          'Runtime table уже использует DataTableUI.',
          'DashboardTable пока остается отдельной editable-таблицей.'
        ]
      },
      {
        type: 'list',
        title: 'Следующие улучшения',
        items: [
          'Editable mode.',
          'Column visibility.',
          'Loading/empty/error states.',
          'Export hooks.',
          'Virtualized rows для больших объемов данных.'
        ]
      }
    ]
  },
  {
    id: 'persistence',
    title: 'Сохранение состояния',
    description: 'Единый механизм сохранения UI state в localStorage.',
    blocks: [
      {
        type: 'text',
        body: [
          'src/composables/usePersistedState.ts содержит loadPersistedState, savePersistedState и usePersistedState.',
          'Dashboard использует usePersistedState для фильтров, активных метрик и типа графика. ToolRuntime использует load/save helpers, потому что ключ зависит от загруженного конфига инструмента.'
        ]
      },
      {
        type: 'code',
        title: 'Формат хранения',
        language: 'json',
        code: '{\n  "version": 1,\n  "state": {}\n}'
      }
    ]
  },
  {
    id: 'backend',
    title: 'Будущий backend',
    description: 'PostgreSQL и API заменят mock JSON registry.',
    blocks: [
      {
        type: 'list',
        title: 'Что должно храниться в БД',
        items: [
          'ToolConfig: описание инструмента, layout, components, filters.',
          'Права доступа: какие пользователи и роли видят какие инструменты.',
          'Data source bindings: откуда брать данные для chart/table/info-panel.',
          'User state: сохраненные фильтры и настройки пользователя.',
          'Версии конфигов и статус публикации.'
        ]
      },
      {
        type: 'code',
        title: 'Будущие endpoints',
        language: 'text',
        code: 'GET /api/tools\nGET /api/tools/:slug\nGET /api/tools/:slug/data\nPOST /api/tools/:slug/state'
      }
    ]
  }
]
