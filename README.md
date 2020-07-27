# ng-eventstore-listing

## Installation

Run in your angular project folder:
```
npm install ng-eventstore-listing
```

## Demo
[Demo](https://saperiumrocks.github.io/ng-eventstore-listing/)

## Usage

#### Add this to your module:

```
import { NgEventstoreListingModule } from 'ng-eventstore-listing';
...
imports: [
  ...
  NgEventstoreListingModule
]
...
```

#### Use the following markup in your HTML:
```
<lib-ng-eventstore-listing
  [idPropertyName]="idPropertyName"
  [inputDataList]="data"
  [itemComponentClass]="rowComponentClass">
</lib-ng-eventstore-listing>
```

## Inputs

| Input | Default | Type | Required? | Description |
| ----- | ------- | ---- | --------- | ----------- |
| itemComponentClass | null | Component | Yes | Type / Class of the component that will be used as the rows |
| inputDataList | [] | any[] | Yes | The array of items that will be displayed |
| idPropertyName | 'id' | string | No | The identifying property existing in each item of the array in *inputDataList* |
| lookups | {} | object | No | Optional lookups to be accessible inside the items component |
| listHeaderGroups | { groups: [] } | No | [ListHeaderGroups](#ListHeaderGroups) | Optional object describing the headers of the table rows |
| subscriptionTopicConfigurations | [] | No | [SubscriptionTopicConfiguration](#SubscriptionTopicConfiguration) | Array of configurations for UI updating subscriptions |

## Outputs

| Output | Description |
| ------ | ----------- |
| updateEmitter | Fires whenever there is an update call from the row component |
| updateLookupsEmitter | Fires whenever there is a request to update the lookups from the API |
| showModalEmitter | Fires when there is a request to open a modal | 
| deleteEmitter | Fires when there is a request for a delete function from the rows |
| sortEmitter | Fires when there is a request to sort the list |
| updateDataList | Fires when there is a request to update the immutable list |

## Types

#### SubscriptionTopicConfiguration
| Property | Type | Required | Description |
| -------- | ---- | -------- | ----------- |
| streamKey | string | Yes | - |
| context | string | Yes | - |
| idPropertyName | string | Yes | - |
| getOffsetsFunction | Function | Yes | - |

#### OffsetsResponse
| Property | Type | Required? | Description |
| -------- | ---- | --------- | ----------- |
| apiVersion | string | Yes | - |
| data | { items: number[] } | Yes | - |

#### ListHeaderGroups
| Property | Type | Required? | Description |
| -------- | ---- | --------- | ----------- |
| generalRowClassName | string | No | - |
| groups | [ListHeaderGroup](#ListHeaderGroup)[] | Yes | - |

#### ListHeaderGroup
| Property | Type | Required? | Description |
| -------- | ---- | --------- | ----------- |
| className | string | No | - |
| listHeaders | [ListHeader](#ListHeader)[] | Yes | - |

#### ListHeader
| Property | Type | Required? | Description |
| -------- | ---- | --------- | ----------- |
| displayName | string | No | - |
| sortProperty | string | No | - |
| className | string | No | - |
