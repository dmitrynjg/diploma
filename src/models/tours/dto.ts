import DTO from '../dto';

export = class TourDTO extends DTO  {
  public id: Number | String | null = null;
  
  public ownerId : Number | String | null = null;

  public from: String | null = null;
 
  public fromCode: String | null = null;

  public to: String | null = null;

  public toCode: String | null = null;

  public numberOfSeats: Number | String | null = null;

  public price: Number | String | null = null;

  public dateStart: String | null = null;

  public dateEnd: String | null = null;

  public desc: String | null = null;

}
