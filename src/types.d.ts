enum gender {
    Male,
    Female
}

enum subscription {
    basic,
    pro,
    premium,
}

enum device {
    mobile,
    desktop,
    watch,
    tv
}

type d = {
    age?: { to?: Number, from?: Number; };
    and?: d;
    device_type?: Array<device>;
    gender?: gender;
    location?: Array<string>;
    or?: d;
    signup_date?: { to?: string, from?: string};
    subscription_plan?: Array<subscription>;
    user_id?: Number;
};