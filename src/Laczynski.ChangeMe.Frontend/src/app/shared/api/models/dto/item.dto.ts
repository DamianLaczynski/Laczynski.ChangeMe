/**
 * Item DTO matching backend ItemDto structure
 *
 * @see Laczynski.ChangeMe.Backend.UseCases.Items.ItemDto
 */
export interface ItemDto {
  /** Unique identifier for the item (Guid serialized as string) */
  id: string;

  /** Name of the item */
  name: string;

  /** Description of the item */
  description: string;

  /** Price of the item (decimal serialized as number) */
  price: number;

  /** Image URL of the item */
  image: string;
}
