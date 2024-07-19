/// <reference path="../pb_data/types.d.ts" />
migrate(
	(db) => {
		const collection = new Collection({
			id: 'duax5t9ob56e3j4',
			created: '2024-07-19 13:22:22.579Z',
			updated: '2024-07-19 13:22:22.579Z',
			name: 'livestreams',
			type: 'base',
			system: false,
			schema: [
				{
					system: false,
					id: 'j5bsypq3',
					name: 'title',
					type: 'text',
					required: true,
					presentable: false,
					unique: false,
					options: {
						min: null,
						max: null,
						pattern: '',
					},
				},
				{
					system: false,
					id: 'vdmzukym',
					name: 'user_id',
					type: 'relation',
					required: true,
					presentable: false,
					unique: false,
					options: {
						collectionId: '_pb_users_auth_',
						cascadeDelete: false,
						minSelect: null,
						maxSelect: 1,
						displayFields: null,
					},
				},
				{
					system: false,
					id: 'revrybjf',
					name: 'thumbnail',
					type: 'file',
					required: true,
					presentable: false,
					unique: false,
					options: {
						mimeTypes: [
							'image/png',
							'image/jpeg',
							'image/webp',
							'image/gif',
							'image/avif',
						],
						thumbs: [],
						maxSelect: 1,
						maxSize: 5242880,
						protected: false,
					},
				},
			],
			indexes: [],
			listRule: '',
			viewRule: '',
			createRule: null,
			updateRule: null,
			deleteRule: null,
			options: {},
		})

		return Dao(db).saveCollection(collection)
	},
	(db) => {
		const dao = new Dao(db)
		const collection = dao.findCollectionByNameOrId('duax5t9ob56e3j4')

		return dao.deleteCollection(collection)
	},
)
