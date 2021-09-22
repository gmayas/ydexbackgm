# ydexbackgm
## Yaydoo BackEnd

Yaydoo BackEnd es una API Rest que fue creada con NodeJS versión 14, con ECMAScript 6, TypeScript y se conecta a una Base de datos PostgreSQL.

Si desean ver en línea Yaydoo BackEnd, solo de clic en el siguiente link:

https://appydexbackgm.herokuapp.com/api/user/

![](/images/img01.png)

## Base de datos PostgreSQL

Para ver las instrucciones SQL utilizadas para la creación de la entidad relación, solo vaya al archivo yaydoo.sql.

![](/images/img02.png)

En la siguiente imagen se muestra el esquema y las tablas creadas en la base de datos PostgreSQL.

![](/images/img03.png)

## Rutas

### getUsers

Sirve para consultar toda la información de la tabla users y la retorna de manera DESC.

![](/images/img04.png)

### createUser

Sirve para crear registro en la tabla users.

![](/images/img05.png)

### modifyPassword/:id_user

Sirve para modificar el registro password_user en la tabla users.

![](/images/img06.png)

Nota: Cada vez que se crea un usuario o se modifica un password, el BackEnd se encarga de cifrarlo. 

### deleteUser/:id_user

Sirve para eliminar registros en la tabla users según su id_user.

![](/images/img07.png)

### getUserDataByIdUser/:id_user

Sirve para consultar toda la información de la tabla userdata según  id_user = id_user_userdata.

![](/images/img08.png)

### createUserData

Sirve para crear registro en la tabla userdata.

![](/images/img09.png)

### modifyUserData/:id_userdata

Sirve para modificar registros en la tabla userdata según su id_userdata.

![](/images/img10.png)

### deleteUserData/:id_userdata

Sirve para eliminar registros en la tabla userdata según su id_userdata.

![](/images/img11.png)

`© 2021 Copyright: GMayaS C:\>Desarrollo en Sistemas.`