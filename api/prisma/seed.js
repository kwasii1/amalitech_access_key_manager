const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');
const crypto = require('crypto');


async function main(){
    const admin = await prisma.user.create({
        data:{
            name:"AKM Admin",
            email:"akm@akm.com",
            account_type:"admin",
            email_verified_at:new Date(),
            password:"$2a$10$VGd.ednsEzgx0hb7P3ark.HL.ck5XyJmfLROrpBgfehgS/Sri5d76",
        }
    })

    for (let i = 0; i < 5; i++) {
		const users = await prisma.user.create({
			data:{
				name:faker.person.fullName(),
				password:"$2a$10$VGd.ednsEzgx0hb7P3ark.HL.ck5XyJmfLROrpBgfehgS/Sri5d76",//password
				email:faker.internet.email(),
				account_type:"user",
				school_name:faker.company.name(),
			}
		})

		for (let i = 0; i < 3; i++) {
			const key = await prisma.accessKey.create({
				data:{
					user_id:users.id, 
					status:faker.helpers.arrayElement(["active","revoked"]),
					date_of_procurement:new Date(),
					expiry_date:faker.helpers.arrayElement([faker.date.past(),faker.date.future()]),
					key:crypto.randomUUID()
				}
			})

			const payment = await prisma.payment.create({
				data:{
					user_id:users.id,
					access_key_id:key.id,
					payment_method:"mobile_money",
					plan:faker.helpers.arrayElement(['annually','monthly']),
					amount:faker.helpers.arrayElement([200,2000]),
					status:"paid",
					mobile_number:faker.phone.number(),
				}
			})
			
		}
		
	}
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })