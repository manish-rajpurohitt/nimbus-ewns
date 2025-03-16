export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  description: string;
  isActive: boolean;
  links?: Array<{
    _id: string;
    title: string;
    url: string;
    logo: string;
  }>;
  expertise?: string[];
  experience?: string;
  media?: Array<{
    url: string;
    type: string;
  }>;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  slogan?: string;
  media?: Array<{
    url: string;
    type: string;
  }>;
  members?: TeamMember[];
}
