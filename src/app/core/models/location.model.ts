export interface ILocationModel {
  country: string;
  region: string;
  department: string;
  city: string;
  neighborhood: string;
  addresses: any[];
  others: any[];
  googleData: any[];
}

export const locationModel: ILocationModel = {
  country: null,
  region: null,
  department: null,
  city: null,
  neighborhood: null,
  addresses: [],
  others: [],
  googleData: []
} as ILocationModel;

export class LocationModel implements ILocationModel{
  public country: string;
  public region: string;
  public department: string;
  public city: string;
  public neighborhood: string;
  public addresses: any[];
  public others: any[];
  public googleData: any[];

  constructor(googleLocations, locationInfos) {
    this.initAttributes(locationInfos);
    this.getLocation(googleLocations, locationInfos);
  }

  /**
   * @description get address from address elements from google api
   * @param googleLocations element address from google api
   * @param locationInfos country from google api
   */
  getLocation(googleLocations, locationInfos) {
    // delete last element for array
    googleLocations.pop();

    googleLocations.forEach(
      locate => {
        this.intiLocation(locate);
      }
    );
  }

  private intiLocation(locate) {
    let locateType = locate.types[0];
    if (locateType === 'political') {
      locateType = locate.types[1];
    }

    const formattedAddress = locate.formatted_address;
    const address = {
      formattedAddress,
      type: locate.types
    };

    this.formatLocation(locateType, formattedAddress, address);
  }

  private getRegion(regionBrut) {
    let region = regionBrut.split(', ')[0];
    region = region.split(' ')[2];

    if (region.indexOf('\'') > 0) {
      region = region.split('\'')[1];
    }

    if (region === 'Ctre') {
      return 'Centre';
    }

    return region;
  }

  private getDataLocation(dataLocation) {
    const resultCountry = dataLocation.split(', ');
    return resultCountry[resultCountry.length - 2];
  }

  private formatLocation(locateType, formattedAddress, address) {

    if (locateType === 'administrative_area_level_1') {
      this.region = this.getRegion(formattedAddress);
    } else if (locateType === 'administrative_area_level_2') {
      this.department = this.getDataLocation(formattedAddress);
    } else if (locateType === 'sublocality') {
      this.neighborhood = formattedAddress.split(', ')[0];
    } else if (locateType === 'neighborhood') {
      this.neighborhood = formattedAddress.split(', ')[0];
    } else if (locateType === 'street_address') {
      console.log('----------------------------------------', address);
      this.addresses.push(address);
    } else if (locateType === 'route') {
      this.addresses.push(address);
      if (this.neighborhood === null) {
        this.neighborhood = formattedAddress.split(', ')[0];
      }
    } else {
      this.others.push(address);
      if (this.neighborhood === null) {
        this.neighborhood = formattedAddress.split(', ')[0];
      }
    }

    this.googleData.push(address);
  }

  private initAttributes(locationInfos) {
    this.country = locationInfos[1];
    this.city = locationInfos[0];
    this.region = null;
    this.department = null;
    this.neighborhood = null;
    this.addresses = [];
    this.others = [];
    this.googleData = [];
  }
}
