package com.traveleasy.traveleasybackend.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.traveleasy.traveleasybackend.models.entities.EventEntity;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class CheckoutRequest {
//    events:events,
//    pice:"",
//    card_numer:cardNr,
//    expiration_date:expDate,
//    ccv_cvc:ccv

    List<EventEntity> events;

    double price;

    String card_number;

    @JsonFormat(pattern="yyyy-MM-dd")
    Date expiration_date;

    String ccv_cvc;

}
