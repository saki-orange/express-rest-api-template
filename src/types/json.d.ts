declare type JSONSerializable = JSONSerializablePrimitive | JSONSerializableArray | JSONSerializableObject;

type JSONSerializablePrimitive = null | boolean | string | number;
type JSONSerializableObject = JSONSerializableObjectStringKey | JSONSerializableObjectNumberKey;
type JSONSerializableObjectStringKey = { [key: string]: JSONSerializable };
type JSONSerializableObjectNumberKey = { [key: number]: JSONSerializable };
type JSONSerializableArray = Array<JSONSerializable>;
