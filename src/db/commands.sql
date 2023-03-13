CREATE TABLE user
(
    user_id           int      not null primary key,
    name              varchar(255),
    age               smallint not null check ( age between 15 and 100 ),
    gender            enum ("male", "female"),
    signup_date       date,
    subscription_plan enum ("basic", "pro", "premium"),
    device_type       enum ("mobile", "desktop", "watch", "tv"),
    location          varchar(255)
);

SELECT *
FROM user
WHERE ("device_type" IN ('tv', 'desktop', 'mobile'))
  AND ("age" BETWEEN 15 AND 100)
  AND (("gender" is 'Male') OR ("location" is (''Amsterdam' , 'Mumbai' , 'Kolkata' ')) OR
       (("subscription_plan" IN ('basic', 'pro')) AND ("gender" is 'Female')));