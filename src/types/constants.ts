export enum Collection {
	Product = 'Product',
	User = 'User',
}


export enum Gender {
	male='male',
	female='female',
	other='other',
	// undefined='undefined',
}
// export enum Role {
// 	vendor='vendor',
// 	user='user',
// 	admin='admin',
// }


export const Roles = {
  VENDOR: 'vendor',
  USER: 'user',
  ADMIN: 'admin',
} as const;

// type Role = keyof typeof Roles 												// => "VENDOR" | "USER" | "ADMIN"
// type Role = [keyof typeof Roles] 											// => [ "VENDOR" | "USER" | "ADMIN" ]
// type Role = (typeof Roles)[keyof typeof Roles] 				// => type Role = "vendor" | "user" | "admin"

// const roles = Object.values(Roles) 										// => [ 'vendor', 'user', 'admin' ]