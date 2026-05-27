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
          'ToolRuntimeView отдельно загружает данные для dataSources инструмента.',
          'LayoutRenderer и ComponentRenderer собирают страницу из layout areas и components.',
          'Состояние инструмента сохраняется в localStorage через общий persistence helper.'
        ]
      },
      {
        type: 'code',
        title: 'Runtime flow',
        language: 'text',
        code: '/tools -> fetchToolCatalog() -> карточки инструментов\n/tools/:slug -> fetchToolConfig(slug) -> validateToolConfig() -> fetchToolDataSources(config) -> ToolRuntimeView -> ToolLayoutRenderer -> ToolComponentRenderer'
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
          'src/db/toolData: временные JSON-данные инструментов, будущая замена на data endpoints.',
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
          'dataSources: декларативные описания источников данных и filter bindings. Реальные rows хранятся отдельно.'
        ]
      },
      {
        type: 'code',
        title: 'Минимальная форма',
        language: 'ts',
        code: "type ToolConfig = {\n  id: string\n  slug: string\n  title: string\n  version: number\n  catalog: { description: string; accentColor: string }\n  navigation: { label: string; icon: string; order: number }\n  persistence: { key: string; state: boolean; configCache: boolean }\n  defaultState: Record<string, unknown>\n  layout: ToolLayoutConfig\n  // Здесь только описание источника и filter bindings, без rows.\n  dataSources: Record<string, ToolDataSourceConfig>\n}"
      }
    ]
  },
  {
    id: 'data-sources',
    title: 'Data Sources',
    description: 'Данные инструментов отделены от ToolConfig, чтобы runtime был готов к backend и большим объемам данных.',
    blocks: [
      {
        type: 'text',
        body: [
          'Раньше rows лежали прямо внутри src/db/tools/*.json. Это удобно для демо, но плохо для backend: конфиг инструмента становится тяжелым, смешивает описание интерфейса и данные, а фильтры невозможно нормально прокинуть в API.',
          'Теперь ToolConfig описывает только интерфейс, layout, components и привязки к dataSourceId. Реальные rows лежат отдельно в src/db/toolData/*.data.json и грузятся через сервис toolDataRegistry.'
        ]
      },
      {
        type: 'list',
        title: 'Новые сущности',
        items: [
          'ToolDataSourceConfig: описание источника в ToolConfig, например id и filterBy.',
          'ToolDataPayload: payload с rows для конкретного slug инструмента.',
          'ToolDataSources: runtime-структура, где metadata из config слита с rows из data payload.',
          'fetchToolDataSources(config): временный mock-метод, который имитирует будущий backend endpoint.'
        ]
      },
      {
        type: 'code',
        title: 'Разделение config и data',
        language: 'text',
        code: 'src/db/tools/poirot.json\n  -> layout, components, filters, dataSource bindings\n\nsrc/db/toolData/poirot.data.json\n  -> rows для chart/table/info-panel'
      },
      {
        type: 'code',
        title: 'Runtime загрузка',
        language: 'ts',
        code: "// Сначала грузится и валидируется описание инструмента.\nconst configResult = await fetchToolConfig(slug)\n\n// Потом отдельно грузятся данные для dataSourceId из конфига.\nconst dataResult = await fetchToolDataSources(configResult.config)\n\n// В renderer передается config отдельно от rows.\n<ToolLayoutRenderer\n  :config=\"toolConfig\"\n  :data-sources=\"toolDataSources\"\n  :state=\"toolState\"\n/>"
      },
      {
        type: 'text',
        title: 'Зачем это нужно',
        body: [
          'Такое разделение позволяет backend отдавать каталог и конфиг быстро, без тяжелых таблиц. Данные можно будет грузить отдельно, учитывать права доступа, применять фильтры на сервере и поддерживать пагинацию или виртуализацию.',
          'Следующий backend-эквивалент этого слоя: GET /api/tools/:slug для конфига и GET /api/tools/:slug/data для данных.'
        ]
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
          'ToolComponentRenderer теперь является тонким диспетчером. Он не содержит логику конкретных компонентов, а выбирает renderer из registry по component.type.'
        ]
      }
    ]
  },
  {
    id: 'component-registry',
    title: 'Component Registry',
    description: 'Registry нужен, чтобы runtime расширялся без роста одного большого if/else компонента.',
    blocks: [
      {
        type: 'text',
        body: [
          'Раньше ToolComponentRenderer напрямую содержал filters, chart, table и info-panel. Такой подход быстро ломается, когда типов компонентов становится много.',
          'Теперь каждый тип runtime-компонента живет в отдельном renderer-файле внутри src/components/tools/renderers. Общий ToolComponentRenderer только получает component.type и выбирает подходящий renderer.'
        ]
      },
      {
        type: 'list',
        title: 'Текущие renderer-компоненты',
        items: [
          'ToolFiltersRenderer.vue: рендерит select, dateRange и search фильтры.',
          'ToolChartRenderer.vue: строит labels и series из dataSource и передает их в Chart.vue.',
          'ToolTableRenderer.vue: фильтрует rows и передает их в DataTableUI.',
          'ToolInfoPanelRenderer.vue: показывает данные выбранной точки или строки.',
          'toolRendererUtils.ts: общие функции фильтрации rows, чтения state и форматирования значений.'
        ]
      },
      {
        type: 'code',
        title: 'Registry',
        language: 'ts',
        code: "// Registry связывает строковый component.type из JSON с Vue renderer.\n// Благодаря этому ToolComponentRenderer не знает деталей filters/chart/table.\nexport const toolComponentRegistry: Record<ToolComponentType, Component> = {\n  filters: ToolFiltersRenderer,\n  chart: ToolChartRenderer,\n  table: ToolTableRenderer,\n  'info-panel': ToolInfoPanelRenderer\n}"
      },
      {
        type: 'code',
        title: 'Тонкий dispatcher',
        language: 'vue',
        code: '<!-- renderer вычисляется по component.type -->\n<!-- component, dataSources и state имеют одинаковый контракт для всех renderer-ов -->\n<component\n  :is="renderer"\n  :component="component"\n  :data-sources="dataSources"\n  :state="state"\n  @state-change="handleStateChange"\n/>'
      },
      {
        type: 'code',
        title: 'Пример renderer-компонента',
        language: 'ts',
        code: "// ToolTableRenderer не хранит бизнес-логику инструмента.\n// Он получает dataSourceId из component config и применяет общий фильтр по state.\nconst rows = computed(() => getFilteredRows(\n  props.component.dataSourceId,\n  props.dataSources,\n  props.state\n))"
      },
      {
        type: 'list',
        title: 'Как добавить новый тип компонента',
        items: [
          'Добавить новый literal type в ToolComponentType.',
          'Описать конфиг нового компонента в ToolComponentConfig.',
          'Добавить runtime validation для нового component.type.',
          'Создать renderer в src/components/tools/renderers.',
          'Добавить renderer в toolComponentRegistry.',
          'После этого JSON-инструмент сможет использовать новый component.type.'
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
