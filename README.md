# RONIN

1. Diseño del juego: 
Descripción  
Se trata de un juego por niveles. El objetivo en cada nivel es cumplir el objetivo en cuestión que podrá estar relacionada con acabar con enemigos, evitarlos usando el sigilo, obtener ciertos objetos importantes para la misión, etc. Nuestro protagonista se llama Hattori.   
Ambientación  
En el Japón feudal, los guerreros más letales  eran los samuráis. Pero sin duda alguna, el mejor  de todos y el más cruel era Hattori Hanzo. Cuando su señor lo reclutó siendo un niño, después  de arrasar su aldea, él no miró atrás. Cuando su señor lo sometió al más duro entrenamiento,  recibiendo palizas y torturas, él no se quejó. Se convirtió en el guerrero más peligroso y sanguinario. En la batalla no hacía concesiones a nadie, ni a hombres, ni a mujeres, ni a niños. Su crueldad solo se veía superada por su sentido del deber. Ni siquiera cuando su señor lo alejó del amor de su vida, puso objeción alguna a las órdenes que recibía. Pero todo tiene un límite... Su señor, intentando demostrar su poder, le arrebató a Hattori, lo único que de verdad había amado...  Su pato Kumo. En aquel momento, Hattori decidió exiliarse y convertirse en un Ronin en busca de su pato y de venganza.

2. Principales mecánicas 
Vista cenital, ortogonal. Con Hattori (nuestro samurai) en el centro de la pantalla en todo momento.
Existen dos tipos de armas: katanas y shurikens (a distancia).     
Hattori sigue al puntero del ratón siempre, va rotando con el ángulo del puntero y ataca en la dirección hacia donde clicamos. El movimiento se realiza con las teclas ‘a’, ’s’, ’d’ y ’w’. Con la tecla ‘q’ se alterna entre katana y shuriken, y con el click izquierdo se ataca.
Kumo, acompaña a Hattori después del primer nivel. Hattori podrá mandarle que se quede esperando en un lugar o bien, que le siga a donde vaya. Esto se realiza con la tecla ‘e’.
Kumo, eventualmente podrá atacar a los enemigos abalanzándose contra ellos, con el click derecho.
Antes de un nivel, se presentará a modo de introducción, el nivel en cuestión.
 
Referentes  
El sistema por niveles está basado en la gran mayoría de juegos de este calibre, de plataformas con un objetivo final. La vista cenital y el sistema de combate está inspirado en el juego StickArena de XGen Studios.   

3. Diseño de la implementación: 
EL videojuego ha sido desarrollado en Quintus, cambiando el quintus_input para incorporar en ciertas ocasiones los eventos deseados. Usamos una arquitectura basada en clases, entre las que destacamos a Hattori (protagonista), enemigos, Kumo y armas. 
4. Equipo de trabajo y reparto de tareas:
Por lo general hemos trabajado siempre los tres componentes del grupo juntos, aunque cabe destacar algunos esfuerzos extraordinarios en ciertos temas.
Marcos Laina: (30%) Integración en o-canvas (al final decidimos pasar a Quintus), Sistema de audio, diferentes niveles, HUD
David Martín-Maldonado: (40%) Introducción del juego, introducción de objetos consumibles, modificación de Quintus_input, el ataque con katana, herencia de los enemigos
Javier Sandoval: (30%) funciones matemáticas de lógicas de movimiento y posiciones, Mapa nivel 1, conos de visión
4. Fuentes y referencias: 
Audio:
•	Grito Wilhelm (al morir un enemigo);
•	Música de victoria nivel 1 y música de nivel 3. BSO STAR WARS, John Williams
•	Música de persecución. Yakety Sax, Boots Randolph y James Q. "Spider" Rich.
•	Música de fondo. Ancient Evil, C21 FX
Imágenes:
•	Introducción: DebianArt
•	Samurai muerto: Taringa
•	Kumo Muere: Samurai Jack
•	Kumo by Enrique Ituarte.
•	Las demás imágenes, han sido diseñadas por Marcos Laina, samurais, katana, shuriken, poción, y bolsa de shuriken









