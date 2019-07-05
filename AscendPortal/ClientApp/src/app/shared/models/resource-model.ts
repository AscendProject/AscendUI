export interface ResourceModel {
  ResourceId: string,
  ResourceType: ResourceTypes[],
  ResourceTitle: string,
  ResourceDescription: string,
  isActive: boolean,
  ResourceURL: string
}

export interface ResourceTypes {
  ExternalUrl: string,
  Document: string
}
