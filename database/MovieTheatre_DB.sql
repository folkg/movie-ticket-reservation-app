DROP DATABASE IF EXISTS MOVIETHEATRE;
CREATE DATABASE MOVIETHEATRE; 
USE MOVIETHEATRE;

DROP TABLE IF EXISTS REGISTERED_USER;
CREATE TABLE REGISTERED_USER (
	user_id					varchar(30)	not null,
    user_name				varchar(30)	not null,
    address					varchar(30)	not null,
    credit_credentials		integer,
    debit_credentials		integer,
	primary key (user_id)
);

DROP TABLE IF EXISTS MOVIE;
CREATE TABLE MOVIE (
	movie_id					varchar(30)	not null,
	movie_name					varchar(30)	not null,
    primary key (movie_id)
);

DROP TABLE IF EXISTS THEATRE;
CREATE TABLE THEATRE(
	theatre_id					varchar(30)	not null,
	theatre_name 				varchar(30)	not null,
    primary key (theatre_id)
);

DROP TABLE IF EXISTS SHOWING;
CREATE TABLE SHOWING(
	theatre_id					varchar(30)	not null,
	movie_id					varchar(30)	not null,
    show_time					DateTime,
    primary key (theatre_id,movie_id,show_time),
    foreign key (theatre_id) references THEATRE(theatre_id),
    foreign key (movie_id) references MOVIE(movie_id)
);

DROP TABLE IF EXISTS SEATS;
CREATE TABLE SEATS(
	seat_id					varchar(30)	not null,
    theatre_id				varchar(30)	not null,
    movie_id				varchar(30)	not null,
    show_time				DateTime,
    booked					boolean,
    
	primary key (seat_id),
    foreign key (theatre_id,movie_id,show_time) references SHOWING(theatre_id,movie_id,show_time)
    
);

DROP TABLE IF EXISTS TICKET;
CREATE TABLE TICKET(
	ticket_id				varchar(30)	not null,
    user_id					varchar(30) not null,
    seat_id					varchar(30) not null,
	primary key (ticket_id),
    foreign key (seat_id) references SEATS(seat_id)

);



