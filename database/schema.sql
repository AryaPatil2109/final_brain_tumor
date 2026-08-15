--
-- PostgreSQL database dump
--

\restrict nIbalRsmtOwYmnKoQ4nPft6bsRlaGGA6hecJttiNHEUpVA477LW8hZOki87K7xX

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: predictions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.predictions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    prediction character varying(100) NOT NULL,
    confidence double precision NOT NULL,
    image_path character varying(500),
    gradcam_path character varying(500),
    created_at timestamp without time zone NOT NULL
);


--
-- Name: predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.predictions_id_seq OWNED BY public.predictions.id;


--
-- Name: tumor_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tumor_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    display_name character varying(150) NOT NULL,
    short_description text NOT NULL,
    description text NOT NULL,
    symptoms text NOT NULL,
    causes text NOT NULL,
    risk_factors text NOT NULL,
    diagnosis text NOT NULL,
    treatment text NOT NULL,
    prognosis text NOT NULL,
    mri_image character varying(500),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: tumor_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tumor_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tumor_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tumor_types_id_seq OWNED BY public.tumor_types.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: predictions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predictions ALTER COLUMN id SET DEFAULT nextval('public.predictions_id_seq'::regclass);


--
-- Name: tumor_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tumor_types ALTER COLUMN id SET DEFAULT nextval('public.tumor_types_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: predictions predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_pkey PRIMARY KEY (id);


--
-- Name: tumor_types tumor_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tumor_types
    ADD CONSTRAINT tumor_types_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ix_predictions_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_predictions_id ON public.predictions USING btree (id);


--
-- Name: ix_predictions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_predictions_user_id ON public.predictions USING btree (user_id);


--
-- Name: ix_tumor_types_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_tumor_types_id ON public.tumor_types USING btree (id);


--
-- Name: ix_tumor_types_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_tumor_types_name ON public.tumor_types USING btree (name);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: predictions predictions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict nIbalRsmtOwYmnKoQ4nPft6bsRlaGGA6hecJttiNHEUpVA477LW8hZOki87K7xX

