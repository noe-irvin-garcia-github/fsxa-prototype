import type { Dataset, QueryBuilderQuery } from 'fsxa-api'
import { ComparisonQueryOperatorEnum } from 'fsxa-api'
import { FSXABaseSection } from 'fsxa-pattern-library'
import { Component } from 'vue-property-decorator'
import { Sections } from 'fsxa-ui'
import Loader from '../../Loader'

interface Payload {
  filterParams: {
    category?: string
  }
  entityType: string
  schema: string
}
@Component({
  name: 'CategoryProducts'
})
class CategoryProducts extends FSXABaseSection<Payload> {
  serverPrefetch() {
    return this.fetchProducts()
  }

  mounted() {
    if (!this.products) {
      this.fetchProducts()
    }
  }

  // TODO: this function is for backwards compatibility, remove it if backwards compatibility is no longer required
  getFilterKey(categoryString: string): string {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/
    if (uuidRegex.test(categoryString)) {
      return 'formData.tt_categories.value.identifier'
    } else {
      return 'formData.tt_categories.value.label'
    }
  }

  async fetchProducts() {
    const params: QueryBuilderQuery[] = [
      {
        field: 'entityType',
        operator: ComparisonQueryOperatorEnum.EQUALS,
        value: this.payload.entityType
      },
      {
        field: 'schema',
        operator: ComparisonQueryOperatorEnum.EQUALS,
        value: this.payload.schema
      }
    ]
    if (this.payload.filterParams.category) {
      params.push({
        field: this.getFilterKey(this.payload.filterParams.category), // TODO: change this back to 'formData.tt_categories.value.identifier'
        operator: ComparisonQueryOperatorEnum.EQUALS,
        value: this.payload.filterParams.category
      })
    }
    const { items } = await this.fsxaApi.fetchByFilter({
      filters: params,
      locale: this.locale
    })
    this.setStoredItem(this.storedKey, items)
  }

  get storedKey() {
    return `category-products${
      this.payload.filterParams.category
        ? '_' + this.payload.filterParams.category
        : ''
    }`
  }

  get products() {
    return this.getStoredItem<Dataset[]>(this.storedKey)
  }

  render() {
    const ListSection = (Sections as any).ListSection
    return (
      <div class="px-4 md:px-6 lg:px-8 bg-white">
        <ListSection
          items={this.products || []}
          scopedSlots={{
            item: (item: Dataset) => {
              return this.renderContentElement({
                ...item,
                template:
                  item.template === 'products.product_list_item'
                    ? item.template
                    : 'products.product_list_item'
              })
            }
          }}
        >
          {!this.products ? <Loader /> : undefined}
        </ListSection>
      </div>
    )
  }
}
export default CategoryProducts
