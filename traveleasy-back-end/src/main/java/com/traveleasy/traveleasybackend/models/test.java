package com.traveleasy.traveleasybackend.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class test {

    @Id
    int Id;

    String Name;

    public test() {
    }

    public test(int i, String dsa) {
        Id = i;
        Name =dsa;
    }
}
